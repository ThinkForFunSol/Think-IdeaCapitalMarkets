import sys
import nltk
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

nltk.download('punkt', quiet=True)


existing_ideas = [
    "A app for sharing recipes",
    "Decentralized social network"
]

def check_uniqueness(new_idea):
    vectorizer = TfidfVectorizer()
    all_texts = existing_ideas + [new_idea]
    tfidf_matrix = vectorizer.fit_transform(all_texts)
    similarity = cosine_similarity(tfidf_matrix[-1], tfidf_matrix[:-1])
    max_sim = similarity.max()
    return max_sim < 0.8 

if __name__ == "__main__":
    new_idea = sys.argv[1]
    unique = check_uniqueness(new_idea)
    print(str(unique).lower())
