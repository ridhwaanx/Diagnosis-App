# main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
import numpy as np
import re
import nltk
import ssl
from datetime import datetime
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.svm import LinearSVC
from sklearn.calibration import CalibratedClassifierCV
from fastapi.middleware.cors import CORSMiddleware
import joblib
from pathlib import Path
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List, Tuple, Optional  # Add Tuple here
from beanie import Document, Indexed, init_beanie
from pymongo import MongoClient

# Disable SSL verification (temporarily for NLTK downloads)
try:
    _create_unverified_https_context = ssl._create_unverified_context
except AttributeError:
    pass
else:
    ssl._create_default_https_context = _create_unverified_https_context

# Download NLTK resources
def download_nltk_data():
    try:
        nltk.data.find('corpora/stopwords')
    except LookupError:
        nltk.download('stopwords')
    try:
        nltk.data.find('corpora/wordnet')
    except LookupError:
        nltk.download('wordnet')
    try:
        nltk.data.find('corpora/omw-1.4')
    except LookupError:
        nltk.download('omw-1.4')

# Call this before creating the predictor
download_nltk_data()

# Constants
MODEL_PATH = 'disease_predictor_model.joblib'
VECTORIZER_PATH = 'tfidf_vectorizer.joblib'
DATA_PATH = 'Symptom2Disease.csv'
MONGO_DB = "Smart-Diagnosis"
MONGO_URI = "mongodb://localhost:27017/Smart-Diagnosis"

SYMPTOM_SYNONYMS = {
    "fever": [
        "fever", "pyrexia", "hyperthermia", "febrility", "calenture"
    ],
    "cough": [
        "cough", "tussis", "pertussis", "hacking", "whooping"
    ],
    "headache": [
        "headache", "migraine", "cephalalgia", "cephalodynia", "hemicrania"
    ],
    "fatigue": [
        "fatigue", "lassitude", "asthenia", "adynamia", "exhaustion", "enervation"
    ],
    "nausea": [
        "nausea", "emesis", "vomiting", "queasiness", "sickness", "retching"
    ],
    "pain": [
        "pain", "ache", "dolor", "algia", "odynia", "soreness", "tenderness", "discomfort"
    ],
    "dizziness": [
        "dizziness", "vertigo", "lightheadedness", "wooziness", "giddiness"
    ],
    "rash": [
        "rash", "exanthem", "urticaria", "eruption", "dermatitis", "eczema"
    ],
    "swelling": [
        "swelling", "edema", "tumescence", "inflation", "puffiness", "distension"
    ],
    "itching": [
        "itching", "pruritus", "scratching", "irritation", "formication"
    ],
    "vomiting": [
        "vomiting", "emesis", "regurgitation", "ejection", "expulsion", "disgorgement", "vomit"
    ],
    "diarrhea": [
        "diarrhea", "diarrhoea", "flux", "scours", "lientery", "dysentery"
    ],
    "constipation": [
        "constipation", "obstipation", "costiveness", "coprostasis", "dyschezia"
    ],
    "bleeding": [
        "bleeding", "hemorrhage", "haemorrhage", "blood-loss", "extravasation"
    ],
    "bruising": [
        "bruising", "ecchymosis", "contusion", "petechia", "suggillation"
    ],
    "palpitations": [
        "palpitations", "tachycardia", "arrhythmia", "pounding", "throbbing", "fluttering"
    ],
    "shortness-of-breath": [
        "dyspnea", "breathlessness", "orthopnea", "panting", "suffocation", "asphyxia"
    ],
    "confusion": [
        "confusion", "disorientation", "delirium", "bewilderment", "perplexity"
    ],
    "weakness": [
        "weakness", "asthenia", "debility", "enfeeblement", "languor", "listlessness"
    ],
    "numbness": [
        "numbness", "paresthesia", "anesthesia", "hypesthesia", "tingling", "formication"
    ],
    "tremors": [
        "tremors", "trembling", "shaking", "quivering", "shivering", "vibration"
    ],
    "seizures": [
        "seizures", "convulsions", "epilepsy", "ictus", "spasms", "paroxysm"
    ],
    "jaundice": [
        "jaundice", "icterus", "xanthochromia", "yellowing", "cholestasis"
    ],
    "blurred-vision": [
        "blurred-vision", "myopia", "diplopia", "presbyopia", "astigmatism", "amaurosis"
    ],
    "ringing-ears": [
        "tinnitus", "ringing", "buzzing", "hissing", "roaring", "clicking"
    ],
    "heartburn": [
        "heartburn", "pyrosis", "indigestion", "dyspepsia", "reflux", "waterbrash"
    ],
    "incontinence": [
        "incontinence", "enuresis", "leakage", "voiding", "dribbling", "involuntary"
    ],
    "insomnia": [
        "insomnia", "sleeplessness", "wakefulness", "agrypnia", "vigilance", "restlessness"
    ],
    "anxiety": [
        "anxiety", "nervousness", "apprehension", "trepidation", "disquiet", "angst"
    ],
    "depression": [
        "depression", "melancholy", "despondency", "dejection", "despair", "dysthymia"
    ],
    "cramps": [
        "cramps", "spasms", "colic", "clonus", "convulsions", "tenesmus"
    ],
    "fainting": [
        "fainting", "syncope", "swooning", "collapse", "blackout", "unconsciousness"
    ],
    "dehydration": [
        "dehydration", "desiccation", "exsiccation", "thirst", "anhydration", "hypohydration"
    ],
    "hallucinations": [
        "hallucinations", "phantasm", "illusion", "delusion", "phantosmia", "paracusia"
    ],
    "memory-loss": [
        "memory-loss", "amnesia", "forgetfulness", "agnosia", "dementia", "paramnesia"
    ]
}

# Flatten to a set of lemmatized known symptom words for quick lookup
def build_symptom_vocab(lemmatizer):
    vocab = set()
    for syn_list in SYMPTOM_SYNONYMS.values():
        for word in syn_list:
            # preprocess and lemmatize each synonym word
            cleaned = re.sub(r'[^a-zA-Z\s]', '', word.lower())
            tokens = cleaned.split()
            for token in tokens:
                vocab.add(lemmatizer.lemmatize(token))
    return vocab

SYMPTOM_VOCAB = build_symptom_vocab(WordNetLemmatizer())


app = FastAPI(
    title="Disease Prediction API",
    description="An API for predicting diseases based on symptoms using machine learning",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Models
class Symptom(Document):
    user_id: str
    name: str
    date: datetime
    
    class Settings:
        name = "symptoms"

class PredictionRequest(BaseModel):
    symptoms: str
    top_n: int = 3
    user_id: Optional[str] = None  # Added user_id to store symptoms

class DiseasePrediction(BaseModel):
    disease: str
    confidence: float
    info: str

class DiseaseInfoResponse(BaseModel):
    disease: str
    description: str

@app.on_event("startup")
async def startup_event():
    # Initialize MongoDB
    client = AsyncIOMotorClient(MONGO_URI)
    await init_beanie(database=client[MONGO_DB], document_models=[Symptom])
    
    global predictor
    predictor = DiseasePredictor()
    
    # Check if models exist, otherwise train new ones
    if not Path(MODEL_PATH).exists() or not Path(VECTORIZER_PATH).exists():
        print("Training new models...")
        predictor.train_model()
    else:
        print("Loading pre-trained models...")
        if not predictor.load_saved_models():
            print("Failed to load models. Training new ones...")
            predictor.train_model()

class DiseasePredictor:
    def __init__(self):
        self.model = None
        self.tfidf = None
        self.lemmatizer = WordNetLemmatizer()
        self.stop_words = set(stopwords.words('english'))
        self.disease_info = {
            "Psoriasis": "Chronic skin condition with red, scaly patches",
            "Varicose Veins": "Enlarged, swollen veins often appearing blue or dark purple",
            "Typhoid": "Bacterial infection causing high fever and abdominal pain",
            "Chicken pox": "Viral infection causing itchy blisters",
            "Impetigo": "Highly contagious skin infection with red sores",
            "Dengue": "Mosquito-borne illness causing high fever and severe joint pain",
            "Fungal infection": "Skin infection caused by fungi",
            "Common Cold": "Viral infection of the upper respiratory tract",
            "Pneumonia": "Lung infection causing inflammation of air sacs",
            "Dimorphic Hemorrhoids": "Swollen veins in the anal region",
            "Arthritis": "Joint inflammation causing pain and stiffness",
            "Acne": "Skin condition with pimples and blackheads",
            "Bronchial Asthma": "Chronic inflammatory disease of the airways",
            "Hypertension": "High blood pressure",
            "Migraine": "Severe headache often with nausea and light sensitivity",
            "Cervical spondylosis": "Age-related wear and tear of spinal disks",
            "Jaundice": "Yellowing of skin and eyes due to liver problems",
            "Malaria": "Mosquito-borne disease causing fever and chills",
            "urinary tract infection": "Infection in any part of the urinary system",
            "allergy": "Immune system reaction to foreign substances",
            "gastroesophageal reflux disease": "Chronic digestive disease",
            "drug reaction": "Adverse reaction to medications"
        }

    def preprocess_text(self, text):
        """Clean and preprocess text for analysis"""
        text = text.lower()
        text = re.sub(r'[^a-zA-Z\s]', '', text)
        words = [self.lemmatizer.lemmatize(word) 
                for word in text.split() 
                if word not in self.stop_words and len(word) > 2]
        return ' '.join(words)

    def load_data(self):
        """Load and prepare the dataset"""
        df = pd.read_csv(DATA_PATH)
        df['processed_text'] = df['text'].apply(self.preprocess_text)
        return df

    def train_model(self):
        """Train and save the disease prediction model"""
        df = self.load_data()
        
        self.tfidf = TfidfVectorizer(max_features=5000, ngram_range=(1, 2))
        X = self.tfidf.fit_transform(df['processed_text'])
        y = df['label']
        
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42)
        
        base_model = LinearSVC(max_iter=10000)
        self.model = CalibratedClassifierCV(base_model)
        self.model.fit(X_train, y_train)
        
        # Save models
        joblib.dump(self.model, MODEL_PATH, compress=3)
        joblib.dump(self.tfidf, VECTORIZER_PATH, compress=3)

    def load_saved_models(self):
        """Load pre-trained models"""
        try:
            self.model = joblib.load(MODEL_PATH)
            self.tfidf = joblib.load(VECTORIZER_PATH)
            return self.model is not None and self.tfidf is not None
        except Exception as e:
            print(f"Error loading models: {e}")
            return False

    def predict(self, symptoms: str, top_n: int = 3) -> List[Tuple[str, float]]:
        """Make predictions with confidence scores"""
        if not self.model or not self.tfidf:
            raise ValueError("Models not loaded")
        
        processed_input = self.preprocess_text(symptoms)
        input_vector = self.tfidf.transform([processed_input])
        probabilities = self.model.predict_proba(input_vector)[0]
        
        classes = self.model.classes_
        top_indices = np.argsort(probabilities)[-top_n:][::-1]
        
        return [(classes[i], float(probabilities[i])) for i in top_indices]

    def get_disease_info(self, disease_name: str) -> str:
        """Get additional information about a disease"""
        return self.disease_info.get(disease_name, "No additional information available.")

@app.post("/predict", response_model=List[DiseasePrediction])
async def predict_disease(request: PredictionRequest):
    try:
        if len(request.symptoms) < 10:
            raise HTTPException(
                status_code=400, 
                detail="Please provide more detailed symptoms (at least 10 characters)"
            )
        
        predictions = predictor.predict(request.symptoms, request.top_n)
        
        # Store symptoms in MongoDB if user_id is provided
        if request.user_id:
            symptom_names = set()
            
            processed_text = predictor.preprocess_text(request.symptoms)
            input_words = processed_text.split()

            for word in input_words:
                if word in SYMPTOM_VOCAB:
                    symptom_names.add(word)
            
            # Store each symptom separately
            for symptom_name in symptom_names:
                symptom = Symptom(
                    user_id=request.user_id,
                    name=symptom_name,
                    date=datetime.now()
                )
                await symptom.save()
        
        return [
            {
                "disease": disease,
                "confidence": confidence,
                "info": predictor.get_disease_info(disease)
            }
            for disease, confidence in predictions
        ]
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=str(e)
        )

@app.get("/disease-info/{disease_name}", response_model=DiseaseInfoResponse)
async def get_disease_info(disease_name: str):
    info = predictor.get_disease_info(disease_name)
    if info == "No additional information available.":
        raise HTTPException(status_code=404, detail="Disease not found")
    return DiseaseInfoResponse(disease=disease_name, description=info)

@app.get("/symptoms/{user_id}", response_model=List[dict])
async def get_user_symptoms(user_id: str):
    """Get all symptoms for a specific user"""
    symptoms = await Symptom.find(Symptom.user_id == user_id).to_list()
    return [
        {
            "name": symptom.name,
            "date": symptom.date.isoformat()
        }
        for symptom in symptoms
    ]

@app.get("/health")
async def health_check():
    # Check MongoDB connection
    try:
        client = MongoClient(MONGO_URI)
        client.server_info()  # Will raise exception if can't connect
        mongo_status = "connected"
    except Exception as e:
        mongo_status = f"disconnected: {str(e)}"
    
    return {
        "status": "healthy",
        "models_loaded": predictor.model is not None and predictor.tfidf is not None,
        "mongodb": mongo_status
    }