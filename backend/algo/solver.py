from models import Patient, Chambre

class HospitalSolver:
    def resoudre(self, patients: list[Patient], chambres: list[Chambre]):
        """
        Algorithme d'optimisation par score de priorité.
        """
        affectations = {}
        
        # 1. État des lieux des capacités réelles
        # On calcule la place restante : (Capacité totale - Patients déjà présents)
        capacites_actuelles = {
            c.id: c.capacite - len(c.patients) 
            for c in chambres
        }

        # 2. Filtrer les patients qui ont besoin d'une place
        patients_a_traiter = [p for p in patients if p.chambre_id is None]

        # 3. Trier les patients par importance (ex: ceux avec une spécialité en premier)
        # Un patient avec une spécialité "Urgence" pourrait passer avant "Général"
        patients_a_traiter.sort(key=lambda p: (p.specialite is not None), reverse=True)

        for patient in patients_a_traiter:
            scores_chambres = []

            for chambre in chambres:
                # CONTRAINTE STRICTE 1 : La chambre doit avoir de la place
                if capacites_actuelles[chambre.id] <= 0:
                    continue

                # CALCUL DU SCORE D'OPTIMISATION
                score = 0

                # RÈGLE A : Correspondance du service (Priorité Absolue)
                if patient.specialite == chambre.service:
                    score += 100 
                
                # RÈGLE B : Optimisation du remplissage
                # On préfère remplir une chambre qui a déjà quelqu'un du même service 
                # plutôt que d'ouvrir une nouvelle chambre vide (économie de personnel)
                if len(chambre.patients) > 0 and patient.specialite == chambre.service:
                    score += 50

                # RÈGLE C : Mixité (Si pas le même service, on évite d'envoyer le patient là-bas)
                if chambre.service and patient.specialite != chambre.service:
                    score -= 50

                scores_chambres.append((score, chambre.id))

            # 4. Affectation du patient à la meilleure option trouvée
            if scores_chambres:
                # On trie par score décroissant
                scores_chambres.sort(key=lambda x: x[0], reverse=True)
                meilleure_chambre_id = scores_chambres[0][1]

                affectations[patient.id] = meilleure_chambre_id
                
                # Mise à jour de la capacité locale pour le prochain patient de la boucle
                capacites_actuelles[meilleure_chambre_id] -= 1

        return affectations

# Export pour FastAPI
solver = HospitalSolver()