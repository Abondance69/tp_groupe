// controllers/articleController.js
const Article = require('../../models/article');
const config = require('../../config/config');

// Méthode pour créer un nouvel article
exports.create = async (req, res) => {
    // get body content of request
    const { name, content, userId } = req.body
    try {
        const article = await Article.create({
            name,
            content,
            userId
        })
        if (!article.id){
            return res.status(400).json({ msg: 'BAD REQUEST'})
        }
        return res.status(200).json({ msg: 'OK', article: article.dataValues})
    } catch (e) {
        console.error(e.message)
        return res.status(400).json({ msg: 'BAD REQUEST' + e.message})
    }
};


// Méthode pour mettre à jour un article
exports.update = async (req, res) => {
    try {
        // Vérifier si l'utilisateur est connecté
        if (!req.user) {
            return res.status(401).json({ message: 'Vous devez être connecté pour mettre à jour un article.' });
        }
        const articleId = req.params.id;
        const { name, content } = req.body;
        const article = await Article.findByPk(articleId);
        if (!article) {
            return res.status(404).json({ message: 'Article non trouvé.' });
        }
        // Vérifier si l'utilisateur est l'auteur de l'article
        if (article.userId !== req.user.id) {
            return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à mettre à jour cet article.' });
        }
        article.name = name;
        article.content = content;
        await article.save();
        res.json({ message: 'Article mis à jour avec succès.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};

// Méthode pour supprimer un article
exports.delete = async (req, res) => {
    try {
        // Vérifier si l'utilisateur est connecté
        if (!req.user) {
            return res.status(401).json({ message: 'Vous devez être connecté pour supprimer un article.' });
        }
        const articleId = req.params.id;
        const article = await Article.findByPk(articleId);
        if (!article) {
            return res.status(404).json({ message: 'Article non trouvé.' });
        }
        // Vérifier si l'utilisateur est l'auteur de l'article
        if (article.userId !== req.user.id) {
            return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à supprimer cet article.' });
        }
        await article.destroy();
        res.json({ message: 'Article supprimé avec succès.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};