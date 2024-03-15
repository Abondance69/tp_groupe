// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('models/User');

// Route pour l'inscription
router.post('/register', async (req, res) => {
    
    try {
        const { firstName, lastName, email, password, pseudo } = req.body;
        // Vérifier si l'utilisateur existe déjà
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'Cet utilisateur existe déjà.' });
        }
        // Créer un nouvel utilisateur
        user = new User({ firstName, lastName, email, password, pseudo });
        // Hachage du mot de passe
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        // Enregistrer l'utilisateur dans la base de données
        await user.save();
        res.status(201).json({ message: 'Utilisateur créé avec succès.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
});

// Route pour la connexion
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Vérifier si l'utilisateur existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });
        }
        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });
        }
        // Générer le token JWT
        const payload = { user: { id: user.id } };
        jwt.sign(payload, 'secretKey', { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
});

module.exports = router;
