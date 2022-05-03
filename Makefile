
.PHONY: check
check:
	source .env && serverless invoke local --function check \
	  -e GAME_NAME=$$GAME_NAME \
	  -e SLACK_WEBHOOK_URL=$$SLACK_WEBHOOK_URL \
	  -e TABLE_ID=$$TABLE_ID \
	  -e NOTIFY_MINUTES=$$NOTIFY_MINUTES \
	  -e TABLE_REGION=$$TABLE_REGION
