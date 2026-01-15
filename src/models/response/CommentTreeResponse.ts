import type { CommentResponse } from './CommentResponse';

export interface CommentTreeResponse extends CommentResponse {
    children?: CommentTreeResponse[];
}
