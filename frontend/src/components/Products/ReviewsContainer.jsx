import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteReview, postReview } from "../../store/slices/productSlice";
import { Star } from "lucide-react";

const ReviewsContainer = ({ product, productReviews }) => {
  const { authUser } = useSelector((state) => state.auth);
  const { isReviewDeleting, isPostingReview } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("rating", rating);
    data.append("comment", comment);
    dispatch(postReview({ productId: product.id, review: data, user: authUser }));
    setRating(1);
    setComment("");
  };

  return (
    <>
      {authUser && (
        <form
          onSubmit={handleReviewSubmit}
          className="mb-8 space-y-4 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md dark:shadow-lg"
        >
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Leave a Review
          </h4>

          {/* Rating Stars */}
          <div className="flex items-center space-x-2">
            {[...Array(5)].map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setRating(i + 1)}
                className={`text-2xl ${
                  i < rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"
                }`}
              >
                ☆
              </button>
            ))}
          </div>

          {/* Comment Box */}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Write your review..."
            className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPostingReview}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:scale-[1.02] active:scale-[0.98] transition-transform duration-300 disabled:opacity-50"
          >
            {isPostingReview ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}

      {/* Reviews List */}
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Customer Reviews
      </h3>

      {productReviews && productReviews.length > 0 ? (
        <div className="space-y-6">
          {productReviews.map((review) => (
            <div
              key={review.review_id}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md dark:shadow-lg"
            >
              <div className="flex items-start space-x-4">
                <img
                  src={review.reviewer?.avatar?.url || "/avatar-holder.avif"}
                  alt={review?.reviewer?.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      {review?.reviewer?.name}
                    </h4>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(review.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-gray-500 dark:text-gray-400 mb-2">{review.comment}</p>

                  {authUser?.id === review.reviewer?.id && (
                    <button
                      onClick={() =>
                        dispatch(
                          deleteReview({
                            productId: product.id,
                            reviewId: review.review_id,
                          })
                        )
                      }
                      className="flex items-center space-x-2 p-3 rounded-lg bg-red-100 dark:bg-red-700 text-red-700 dark:text-red-100 hover:bg-red-200 dark:hover:bg-red-600 transition-colors font-semibold"
                    >
                      {isReviewDeleting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                          <span>Deleting Review...</span>
                        </>
                      ) : (
                        <span>Delete Review</span>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">
          No reviews yet. Be the first one to review this product.
        </p>
      )}
    </>
  );
};

export default ReviewsContainer;