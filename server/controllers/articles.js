import sequelize from 'sequelize';
import { validationResponse } from '@helpers/validationResponse';
import Response from '@helpers/Response';
import models from '@models';
import validateRating from '@validations/rating';
import Pagination from '@helpers/Pagination';

const {
  User, Article, Rating, Profile
} = models;

/**
 * @exports ArticleController
 * @class ArticleController
 * @description Handles Article related actions
 * */
class ArticleController {
  /**
   * Rate an article
   * @async
   * @param  {object} req - Request object
   * @param {object} res - Response object
   * @param {object} next The next middleware
   * @return {json} Returns json object
   * @static
   */
  static async rate(req, res, next) {
    try {
      const userId = req.decoded.id;

      // Validate the rating
      const articleDetails = await validateRating(req.body);

      const { rate } = articleDetails;
      const { slug } = req.params;

      const article = await Article.findOne({ where: { slug } });

      if (!article) return Response.error(res, 404, 'Article does not exist');

      const result = await article.addRating(userId, {
        through: { ratings: rate }
      });

      const updatedArticle = await ArticleController.findArticle({ slug });

      return Response.success(
        res,
        !result || !result[0].dataValues ? 200 : 201,
        { article: updatedArticle },
        'Article has been rated'
      );
    } catch (err) {
      if (err.isJoi && err.name === 'ValidationError') {
        return res.status(400).json({
          status: 400,
          errors: validationResponse(err)
        });
      }
      next(err);
    }
  }

  /**
   *
   *
   * @static
   * @param {*} { articleId, slug }
   * @returns {object} article details
   * @memberof ArticleController
   */
  static async findArticle({ articleId, slug }) {
    const where = {};
    if (articleId) {
      where.articleId = articleId;
    } else if (slug) {
      where.slug = slug;
    } else {
      throw new Error('Parameters undefined');
    }

    return Article.findOne({
      where,
      attributes: [
        'id',
        'slug',
        'title',
        'body',
        'createdAt',
        'updatedAt',
        [
          sequelize.fn('AVG', sequelize.col('articleRatings.ratings')),
          'averageRating'
        ]
      ],
      include: [
        {
          model: Rating,
          as: 'articleRatings',
          required: false,
          attributes: []
        },
        {
          model: User,
          as: 'author',
          attributes: [
            'id',
            'username'
          ],
          include: [{
            model: Profile,
            as: 'profile',
            attributes: ['firstname', 'lastname', 'bio', 'avatar']
          }]
        }
      ],
      group: ['Article.id', 'author.id', 'author->profile.id']
    });
  }

  /**
   * Get article ratings
   * @async
   * @param  {object} req - Request object
   * @param {object} res - Response object
   * @param {object} next The next middleware
   * @return {json} Returns json object
   * @static
   */
  static async getArticleRatings(req, res, next) {
    try {
      const { slug } = req.params;
      const { page, search } = req.query;
      const paginate = new Pagination(page, req.query.limit);
      const { limit, offset } = await paginate.getQueryMetadata();

      // Get the articleId
      const article = await Article.findOne({ where: { slug } });

      if (!article) return Response.error(res, 404, 'Article does not exist');

      const { id: articleId } = article.dataValues;

      const ratings = await Rating.findAndCountAll({
        where: { articleId },
        limit,
        offset,
        attributes: ['ratings', 'createdAt', 'updatedAt', 'deletedAt'],
        include: [{
          model: User,
          as: 'rater',
          attributes: [
            'id',
            'username'
          ],
          include: [{
            model: Profile,
            as: 'profile',
            attributes: ['firstname', 'lastname', 'bio', 'avatar']
          }]
        }
        ]
      });

      const extraQuery = search ? `search=${search}` : '';

      return Response.success(res, 200, { ratings, metadata: paginate.getQueryMetadata(ratings.count, `/articles/${slug}/rate`, extraQuery) });
    } catch (err) {
      next(err);
    }
  }
}

export default ArticleController;
