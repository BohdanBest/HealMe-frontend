import { useState, useEffect } from "react";
import { appointmentApi } from "@/entities/appointment/api/appointmentApi";
import { Button } from "@/shared/ui/Button/Button";
import "./ReviewModal.scss";

interface ReviewModalProps {
  isOpen: boolean;
  appointmentId: string | null;
  onClose: () => void;
}

export const ReviewModal = ({ isOpen, appointmentId, onClose }: ReviewModalProps) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (isOpen && appointmentId) {
      setErrorMsg("");
      loadReview();
    }
  }, [isOpen, appointmentId]);

  const loadReview = async () => {
    if (!appointmentId) return;
    try {
      setIsLoading(true);
      const review = await appointmentApi.getReview(appointmentId);
      setRating(review.rating);
      setComment(review.comment);
      setIsEditMode(true);

      // Check if 24 hours have passed since review creation
      const createdDate = new Date(review.createdAt);
      const hoursPassed = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60);
      if (hoursPassed > 24) {
        setIsReadOnly(true);
      } else {
        setIsReadOnly(false);
      }
    } catch {
      // 404 or other error means no review yet
      setRating(5);
      setComment("");
      setIsEditMode(false);
      setIsReadOnly(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointmentId || isReadOnly) return;

    try {
      setIsSaving(true);
      setErrorMsg("");
      
      if (isEditMode) {
        await appointmentApi.updateReview(appointmentId, { rating, comment });
      } else {
        await appointmentApi.createReview(appointmentId, { rating, comment });
      }
      
      onClose();
    } catch (e: any) {
      console.error(e);
      const data = e?.response?.data;
      let message = "Failed to save review. Please try again.";
      if (typeof data === "string") {
        message = data;
      } else if (data && typeof data === "object") {
        if (data.errors) {
          message = Object.values(data.errors).flat().join(", ");
        } else {
          message = data.title || data.message || JSON.stringify(data);
        }
      }
      setErrorMsg(message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="review-modal-overlay" onClick={onClose}>
      <div className="review-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEditMode ? "Edit Your Review" : "Leave a Review"}</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        {isLoading ? (
          <div className="modal-loading">Loading review details...</div>
        ) : (
          <form onSubmit={handleSave} className="modal-body">
            {isReadOnly && (
              <div className="read-only-banner">
                ⚠️ Reviews can only be edited within 24 hours of submission.
              </div>
            )}

            {errorMsg && <div className="error-banner">{errorMsg}</div>}

            <div className="rating-section">
              <label className="rating-label">Rating</label>
              <div className="stars-container">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    className={`star-btn ${
                      star <= (hoverRating ?? rating) ? "active" : ""
                    } ${isReadOnly ? "disabled" : ""}`}
                    onClick={() => !isReadOnly && setRating(star)}
                    onMouseEnter={() => !isReadOnly && setHoverRating(star)}
                    onMouseLeave={() => !isReadOnly && setHoverRating(null)}
                    disabled={isReadOnly}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="comment-section">
              <label htmlFor="review-comment" className="comment-label">Your Comment</label>
              <textarea
                id="review-comment"
                placeholder={
                  isReadOnly
                    ? ""
                    : "Tell us about your experience with this doctor..."
                }
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={isReadOnly}
                maxLength={500}
                required
              />
            </div>

            <div className="modal-actions">
              <Button type="button" variant="outline" onClick={onClose}>
                {isReadOnly ? "Close" : "Cancel"}
              </Button>
              {!isReadOnly && (
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Submit"}
                </Button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
