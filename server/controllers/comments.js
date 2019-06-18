import models from '@models';
import validateComment from '@validations/comment';
import comments from '@helpers/comments';
import { validationResponse } from '@helpers/validationResponse';

const { Comment } = models;

/**
 * @exports CommentController
 * @class CommentController
 * @description Handles the comment section
 */
class CommentController {
  /**
   * Create new comment
   * @static
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @param {object} next - The Next Middleware
   * @return {json} - Returns json Object
   * @memberof CommentController
   * @static
   */
  static async create(req, res, next) {
    try {
      const data = await validateComment(req.body);
      const body = data.comment;
      const { slug } = req.params;
      const userId = req.decoded.id;
      const { article } = req;

      const comment = await article.createComment({ userId, slug, body });

      const payload = await comments(article.id);

      if (comment) {
        return res.status(201).json({
          status: 201,
          message: 'Comment added successfully.',
          payload
        });
      }
    } catch (error) {
      if (error.isJoi && error.name === 'ValidationError') {
        return res.status(400).json({
          status: 400,
          errors: validationResponse(error)
        });
      }

      next(error);
    }
  }

  /**
   * Get all comments
   * @static
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @param {object} next - The Next Middleware
   * @return {json} - Returns json Object
   * @memberof CommentController
   * @static
   */
  static async getComments(req, res, next) {
    try {
      const { article } = req;

      const payload = await comments(article.id);

      if (payload) {
        return res.status(200).json({
          status: 200,
          message: 'Comments retrieved successfully.',
          payload
        });
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a comment
   * @static
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @param {object} next - The Next Middleware
   * @return {json} - Returns json Object
   * @memberof CommentController
   * @static
   */
  static async updateComment(req, res, next) {
    try {
      const { comment: body } = await validateComment(req.body);
      const { id } = req.params;
      const userId = req.decoded.id;
      const { oldComment } = req;
      const { articleId } = oldComment;

      const commentUpdate = await Comment.update(
        { body },
        { returning: true, where: { id, userId, articleId } }
      );

      const payload = await comments(articleId);

      if (commentUpdate) {
        return res.status(200).json({
          status: 200,
          message: 'Comment updated successfully.',
          payload
        });
      }
    } catch (error) {
      if (error.isJoi && error.name === 'ValidationError') {
        return res.status(400).json({
          status: 400,
          errors: validationResponse(error)
        });
      }
      next(error);
    }
  }

  /**
   * Delete a comment
   * @static
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @param {object} next - The Next Middleware
   * @return {json} - Returns json Object
   * @memberof CommentController
   * @static
   */
  static async deleteComment(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.decoded.id;
      const { oldComment } = req;
      const { articleId } = oldComment;

      const comment = await Comment.destroy({
        where: { id, userId, articleId }
      });

      const payload = await comments(articleId);

      if (comment) {
        return res.status(200).json({
          status: 200,
          message: 'Comment deleted successfully.',
          payload
        });
      }
    } catch (error) {
      next(error);
    }
  }
}

export default CommentController;
