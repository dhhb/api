import express from 'express';
import {
    validateAccessToken,
    validateUserRole
} from '../../../middleware';

export default function () {
    let articles = express.Router();

    articles.get('/',
        findPublished,
        returnArticles
    );

    articles.get('/:id',
        findPublishedById,
        returnArticle
    );

    articles.get('/drafts',
        validateAccessToken,
        findDrafts,
        returnArticles
    );

    articles.get('/drafts/:id',
        validateAccessToken,
        findDraftById,
        returnArticle
    );

    articles.post('/',
        validateAccessToken,
        validateUserRole('writer'),
        createArticle,
        returnArticle
    );

    articles.put('/:id',
        validateAccessToken,
        validateUserRole('writer'),
        updateArticle,
        returnArticle
    );

    articles.del('/:id',
        validateAccessToken,
        validateUserRole('writer'),
        changeArticleStatusToDeleted,
        returnSuccess
    );

    articles.post('/:id/publish',
        validateAccessToken,
        validateUserRole('writer'),
        changeArticleStatusToPublished,
        returnArticle
    );

    function returnArticles () {

    }

    function returnArticle () {

    }

    function returnSuccess () {

    }

    return articles;
}
