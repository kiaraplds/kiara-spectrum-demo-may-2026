#!/usr/bin/env bash
# Cursor hook (stdin JSON): supports postToolUse after Write and afterFileEdit.
# 1. Detects component .tsx writes under react-spectrum package paths
# 2. Runs lightweight accessibility / standards checks on the file
# 3. Posts the result to Slack
#
# Hook payload is JSON on stdin (not $1). Prefer SLACK_WEBHOOK_URL in the environment;
# otherwise set SLACK_WEBHOOK below instead of the placeholder.

SLACK_WEBHOOK="https://hooks.slack.com/services/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"

set -uo pipefail

input=$(cat)
# postToolUse (Write): .tool_input.path; afterFileEdit: .file_path (often absolute)
rel_path=$(
  echo "$input" | jq -r '.tool_input.path // .tool_input.file_path // .file_path // empty' 2>/dev/null
) || true
cwd=$(echo "$input" | jq -r '.cwd // empty'             2>/dev/null) || true

if [[ -z "$rel_path" ]]; then
  exit 0
fi

if [[ "$rel_path" != *.tsx ]]; then
  exit 0
fi

if ! {
  [[ "$rel_path" == *packages/@adobe/react-spectrum/src/* ]] ||
    [[ "$rel_path" == *packages/@react-spectrum/* ]]
}; then
  exit 0
fi

if [[ "$rel_path" == /* ]]; then
  FILE_PATH="$rel_path"
elif [[ -n "$cwd" ]]; then
  FILE_PATH="${cwd%/}/$rel_path"
else
  FILE_PATH="$rel_path"
fi

if [[ ! -f "$FILE_PATH" ]]; then
  echo "notify-slack-spectrum-component: file not found: $FILE_PATH" >&2
  exit 0
fi

COMPONENT_NAME=$(basename "$FILE_PATH" .tsx)

AUDIT_RESULTS=""
ISSUES_FOUND=0

# Check 1 — does the component have ARIA roles or attributes?
if ! grep -q 'role=' "$FILE_PATH" && ! grep -q 'aria-' "$FILE_PATH"; then
  AUDIT_RESULTS+="⚠️ No ARIA attributes found"$'\n'
  ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

# Check 2 — interactive elements have keyboard handlers?
if grep -q 'onClick' "$FILE_PATH" && ! grep -qE 'onKeyDown|onPress' "$FILE_PATH"; then
  AUDIT_RESULTS+="⚠️ onClick used without keyboard handler"$'\n'
  ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

# Check 3 — TypeScript types defined?
if ! grep -qE 'interface.*Props|type.*Props' "$FILE_PATH"; then
  AUDIT_RESULTS+="⚠️ No TypeScript Props interface found"$'\n'
  ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

AUDIT_RESULTS="${AUDIT_RESULTS%$'\n'}"

if [[ $ISSUES_FOUND -eq 0 ]]; then
  AUDIT_STATUS="✅ Passed"
  AUDIT_DETAIL="All accessibility and standards checks passed"
else
  AUDIT_STATUS="⚠️ ${ISSUES_FOUND} issue(s) found"
  AUDIT_DETAIL="$AUDIT_RESULTS"
fi

echo "Audit complete for $COMPONENT_NAME — $AUDIT_STATUS" >&2

if [[ -z "$SLACK_WEBHOOK" || "$SLACK_WEBHOOK" == "YOUR_WEBHOOK_URL_HERE" ]]; then
  echo "notify-slack-spectrum-component: set SLACK_WEBHOOK_URL or SLACK_WEBHOOK to post to Slack" >&2
  exit 0
fi

payload=$(
  jq -n \
    --arg cn "$COMPONENT_NAME" \
    --arg fp "$FILE_PATH" \
    --arg st "$AUDIT_STATUS" \
    --arg det "$AUDIT_DETAIL" \
    '{
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: ("🎨 New Spectrum component: " + $cn),
            emoji: true
          }
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: ("*Status:*\n" + $st)
            },
            {
              type: "mrkdwn",
              text: ("*File:*\n`" + $fp + "`")
            }
          ]
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: ("*Audit details:*\n" + $det)
          }
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: "⚡ Hook fired automatically — accessibility audit ran without engineer prompt"
            }
          ]
        }
      ]
    }' 2>/dev/null
) || true

if [[ -z "$payload" ]]; then
  exit 0
fi

if curl -fsS -X POST -H 'Content-type: application/json' -d "$payload" "$SLACK_WEBHOOK" -o /dev/null; then
  echo "notify-slack-spectrum-component: Slack message sent for ${COMPONENT_NAME}" >&2
else
  echo "notify-slack-spectrum-component: Slack POST failed (audit still ran)" >&2
fi

exit 0
