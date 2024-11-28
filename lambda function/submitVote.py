import json
import boto3

def lambda_handler(event, context):
    
    if 'body' not in event:
        return {
            'statusCode': 400,
            'body': json.dumps('Requête invalide : le corps de la requête est manquant')
        }

    try:
        
        body = json.loads(event['body'])
        candidat_id = body.get('candidat_id')
        print(f"ID du candidat reçu : {candidat_id}")
        
        if not candidat_id:
            return {
                'statusCode': 400,
                'body': json.dumps('Requête invalide : candidat_id manquant')
            }
    except (TypeError, json.JSONDecodeError) as e:
        print(f"Erreur lors du parsing du body : {e}")
        return {
            'statusCode': 400,
            'body': json.dumps('Requête invalide : le format du corps est incorrect')
        }

    
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('Votes')

    try:
        
        response = table.update_item(
            Key={'candidat_id': candidat_id},  
            UpdateExpression="SET votes = if_not_exists(votes, :start) + :inc",
            ExpressionAttributeValues={
                ':inc': 1,
                ':start': 0
            },
            ReturnValues="UPDATED_NEW"
        )
        print(f"Réponse DynamoDB : {response}")
    except Exception as e:
        print(f"Erreur lors de la mise à jour de DynamoDB : {e}")
        return {
            'statusCode': 500,
            'body': json.dumps(f"Erreur lors de l'enregistrement du vote : {str(e)}")
        }

    
    return {
        'statusCode': 200,
        'body': json.dumps('Vote enregistré avec succès')
    }
