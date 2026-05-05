-- Correction de l'adresse email de l'administrateur
-- Remplace admin@car-rental.com par sbbrhaythamcreetou@gmail.com

UPDATE users 
SET email = 'sbbrhaythamcreetou@gmail.com' 
WHERE email = 'admin@car-rental.com';

-- Vérification de la mise à jour
SELECT email, name, role FROM users WHERE role = 'ADMIN';

-- Message de confirmation
SELECT 'Email admin mis à jour: sbbrhaythamcreetou@gmail.com' AS message;
