import axiosClient from "@/libs/axiosClient";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { format } from "date-fns";

interface Props {
  _articleId: string;
}

const Comments = ({ _articleId }: Props) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const articleId = _articleId;
  const [isFocused, setIsFocused] = useState(false);

  const handleContent = (event: any) => {
    setContent(event.target.value as string);
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
    event.preventDefault(); // 폼의 기본 동작 방지
    addComment();
  };

  const handleFocus = () => {
    setIsFocused(true); // 텍스트 필드가 포커스를 받으면 포커스 여부를 true로 설정
  };

  const handleBlur = () => {
    setIsFocused(false); // 텍스트 필드에서 포커스가 벗어나면 포커스 여부를 false로 설정
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
              onFocus={handleFocus}
              onBlur={handleBlur}
              defaultValue="내용을 입력하세요"
            />
          </FormControl>
          {isFocused && (
            <Box marginTop={1}>
              <Button
                variant="outlined"
                color="primary"
                type="submit"
              >
                댓글 작성하기
              </Button>
            </Box>
          )}
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
                <Typography variant="body1">{comment.content}</Typography>
              </div>
            </div>
            <Chip
              label={format(new Date(comment.createDate), "yyyy-MM-dd HH:mm")}
              variant="outlined"
            />
          </Box>
          {index < comments.length - 1 && <Divider variant="middle" />}
        </div>
      ))}
    </div>
  );
};

export default Comments;
