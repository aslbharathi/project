import boto3
from botocore.exceptions import ClientError
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class TranslationService:
    def __init__(self):
        self.translate_client = boto3.client(
            'translate',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION
        )
    
    async def translate_text(self, text: str, source_lang: str, target_lang: str) -> str:
        """Translate text using Amazon Translate"""
        try:
            # Map language codes
            lang_map = {
                'en': 'en',
                'ml': 'ml'  # Malayalam
            }
            
            source_code = lang_map.get(source_lang, 'en')
            target_code = lang_map.get(target_lang, 'en')
            
            if source_code == target_code:
                return text
            
            response = self.translate_client.translate_text(
                Text=text,
                SourceLanguageCode=source_code,
                TargetLanguageCode=target_code
            )
            
            return response['TranslatedText']
            
        except ClientError as e:
            logger.error(f"AWS Translate error: {e}")
            return text  # Return original text if translation fails
        except Exception as e:
            logger.error(f"Translation service error: {e}")
            return text
    
    async def detect_language(self, text: str) -> str:
        """Detect language of text"""
        try:
            response = self.translate_client.detect_dominant_language(Text=text)
            languages = response['Languages']
            
            if languages:
                detected_lang = languages[0]['LanguageCode']
                # Map back to our language codes
                if detected_lang == 'ml':
                    return 'ml'
                else:
                    return 'en'
            
            return 'en'  # Default to English
            
        except Exception as e:
            logger.error(f"Language detection error: {e}")
            return 'en'

# Global instance
translation_service = TranslationService()