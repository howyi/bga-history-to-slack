
.PHONY: check, checkd
check:
	source .env && serverless invoke local --function check \
	  -e GAME_NAME=$$GAME_NAME \
	  -e SLACK_WEBHOOK_URL=$$SLACK_WEBHOOK_URL \
	  -e TABLE_ID=$$TABLE_ID \
	  -e NOTIFY_MINUTES=$$NOTIFY_MINUTES \
	  -e TABLE_REGION=$$TABLE_REGION
checkd:
	docker-compose run --rm bga sh -c "source .env && ./node_modules/.bin/serverless invoke local --function check \
	  -e GAME_NAME=$$GAME_NAME \
	  -e SLACK_WEBHOOK_URL=$$SLACK_WEBHOOK_URL \
	  -e TABLE_ID=$$TABLE_ID \
	  -e NOTIFY_MINUTES=$$NOTIFY_MINUTES \
	  -e TABLE_REGION=$$TABLE_REGION"