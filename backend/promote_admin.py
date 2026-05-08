from database import SessionLocal
import models_db
import sys

def list_users():
    db = SessionLocal()
    users = db.query(models_db.User).all()
    if not users:
        print("INFO : La base de données est vide (aucun utilisateur inscrit).")
    else:
        print("\n=== Liste des utilisateurs inscrits ===")
        for u in users:
            print(f"- {u.email} (Rôle actuel : {u.role})")
    db.close()

def promote_to_admin(email):
    db = SessionLocal()
    try:
        user = db.query(models_db.User).filter(models_db.User.email == email).first()
        if user:
            user.role = "admin"
            db.commit()
            print(f"\n✅ SUCCÈS : L'utilisateur {email} a été promu au rôle ADMIN.")
        else:
            print(f"\n❌ ERREUR : Aucun utilisateur trouvé avec l'email '{email}'.")
            list_users()
    except Exception as e:
        print(f"\n❌ ERREUR : {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        list_users()
        print("\nUsage : python promote_admin.py votre_email@exemple.com")
    else:
        email_to_promote = sys.argv[1]
        promote_to_admin(email_to_promote)
