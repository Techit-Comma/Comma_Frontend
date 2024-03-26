import axiosClient from "@/libs/axiosClient";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { useRecoilState } from "recoil";
import { UserInfos } from "@/types";
import {userInfoDataState, userInfoState} from "@/providers/RecoilContextProvider";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

interface Props {
  _articleId: string;
}

const Comments = ({ _articleId }: Props) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [editCommentId, setEditCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const articleId = _articleId;
  const [userInfos, setUserInfos] = useRecoilState<UserInfos>(userInfoDataState);

  const handleContent = (event: any) => {
    setContent(event.target.value as string);
  };

  const handleEditContent = (event: any) => {
    setEditContent(event.target.value as string);
  };

  useEffect(() => {
    loadComments(articleId);
  }, [articleId]);

  const loadComments = async (articleId: string) => {
    try {
      const response = await axiosClient.get(
        `/community/comments/${articleId}`
      );

      const data = await response.data;

      setComments(data.data.commentList);
    } catch (error) {
      const errorObj = error as Error;
      toast.error(`댓글을 불러오는 데 실패하였습니다. (${errorObj.message})`);
    }
  };

  const addComment = async () => {
    try {
      const response = await axiosClient.post("/community/comments", {
        articleId,
        content,
      });

      const data = await response.data;

      setContent("");
      toast.success("댓글이 작성되었습니다.");

      loadComments(articleId);
    } catch (error) {
      const errorObj = error as Error;
      toast.error(`댓글을 작성하는 데 실패하였습니다. (${errorObj.message})`);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addComment();
  };

  const deleteComment = async (commentId: string) => {
    try {
      await axiosClient.delete(`community/comments/${commentId}`);
      toast.success("댓글을 삭제하였습니다.");
      loadComments(articleId);
    } catch (error) {
      toast.error("댓글 삭제에 실패하였습니다.");
    }
  };

  const selectEditComment = (commentId: any, commentContent: string) => {
    setEditCommentId(commentId);
    setEditContent(commentContent);
  };

  const editComment = async () => {
    try {
      await axiosClient.put(`/community/comments/${editCommentId}`, {
        content: editContent,
      });
      toast.success("댓글을 수정하였습니다.");
      loadComments(articleId);
      setEditCommentId(null);
      setEditContent("");
    } catch (error) {
      toast.error("댓글 수정에 실패하였습니다.");
    }
  };

  return (
    <div>
      <Divider>댓글</Divider>
      <Box>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth>
            <TextField
              color="warning"
              id="content"
              name="content"
              label="댓글을 작성해보세요"
              multiline
              rows={1}
              value={content}
              onChange={handleContent}
              defaultValue="내용을 입력하세요"
            />
          </FormControl>
          <Box marginTop={1}>
            <Button variant="outlined" color="warning" type="submit">
              댓글 작성하기
            </Button>
          </Box>
        </form>
      </Box>
      {comments.map((comment: any, index: number) => (
        <div key={comment.commentId}>
          <Box
            margin={1}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <Avatar alt={comment.username} src={comment.profileUrl} />
              <div className="flex-col items-start justify-center ml-2">
                <Typography variant="subtitle1">{comment.username}</Typography>
                {editCommentId === comment.commentId ? (
                  <Box>
                    <TextField
                      fullWidth
                      multiline
                      rows={1}
                      value={editContent}
                      onChange={handleEditContent}
                    />
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={editComment}
                    >
                      저장
                    </Button>
                    <Button
                      variant="outlined"
                      color="warning"
                      onClick={() => setEditCommentId(null)}
                    >
                      취소
                    </Button>
                  </Box>
                ) : (
                  <Typography variant="body1">{comment.content}</Typography>
                )}
              </div>
            </div>
            <Box display="flex-col" justifyContent="end">
              <Chip
                label={format(new Date(comment.createDate), "yyyy-MM-dd HH:mm")}
                variant="outlined"
              />
              {userInfos.username === comment.username && (
                <Box display="flex" justifyContent="end">
                  <IconButton
                    id="delete-button"
                    onClick={() => deleteComment(comment.commentId)}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    id="edit-button"
                    onClick={() =>
                      selectEditComment(comment.commentId, comment.content)
                    }
                  >
                    <EditIcon />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Box>
          {index < comments.length - 1 && <Divider variant="middle" />}
        </div>
      ))}
    </div>
  );
};

export default Comments;
