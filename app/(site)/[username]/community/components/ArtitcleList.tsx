import { useRouter } from "next/navigation";
import { Divider, Pagination, createTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import axiosClient from "@/libs/axiosClient";
import ProfileButton from "@/components/ProfileButton";
import Comments from "./Comments";
import { useRecoilState } from "recoil";
import { userInfoState } from "@/providers/RecoilContextProvider";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  IconButton,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import Image from "next/image";
import { UserInfos } from "@/types";
import toast from "react-hot-toast";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Modal from "./Modal";
import EditArticle from "./EditArticle";
import { ThemeProvider } from "@emotion/react";
import WriteArticle from "./WriteArticle";

interface Props {
  username: string;
}

const ArticleList = ({ username }: Props) => {
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [articleImages, setArticleImages] = useState(new Map());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState<string>("");
  const [userInfos, setUserInfos] = useRecoilState<UserInfos>(userInfoState);
  const loginedUser = userInfos.username;
  const [editModalOpenMap, setEditModalOpenMap] = useState<
    Map<string, boolean>
  >(new Map());

  useEffect(() => {
    loadArticles("");
  }, [currentPage]);

  const loadArticles = async (category: string) => {
    try {
      const response = await axiosClient.get(
        `/community/articles/user/${username}?page=${currentPage}&category=${category}`
      );

      const data = await response.data;

      const imageMap = new Map<number, string[]>();
      for (const articleId in data.data.articleImages) {
        imageMap.set(parseInt(articleId), data.data.articleImages[articleId]);
      }

      setArticleImages(imageMap);
      setArticles(data.data.articleList.content);
      setTotalPages(data.data.articleList.totalPages);
    } catch (error) {
      const errorObj = error as Error;
      toast.error(`게시글을 불러오는 데 실패하였습니다. (${errorObj.message})`);
    }
  };

  const handleCategory = (
    event: React.MouseEvent<HTMLElement>,
    newCategory: string
  ) => {
    setCategory(newCategory);
    loadArticles(newCategory);
  };

  const deleteArticle = async (articleId: string) => {
    try {
      await axiosClient.delete(`/community/articles/${articleId}`);

      toast.success("글을 삭제하였습니다.");
      loadArticles("");
    } catch (error) {
      toast.error("글 삭제에 실패하였습니다.");
    }
  };

  const handleEditModalOpen = (articleId: string) => {
    setEditModalOpenMap((prevMap) => new Map(prevMap.set(articleId, true)));
  };

  const handleEditModalClose = (articleId: string) => {
    setEditModalOpenMap((prevMap) => new Map(prevMap.set(articleId, false)));
  };

  const handlePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const theme = createTheme({
    palette: {
      mode: "dark", // 다크 모드 사용 설정
    },
  });

  return (
    <ThemeProvider theme={theme}>
      {loginedUser === username && <WriteArticle loadArticles={loadArticles}  username={username} />}
      <Divider variant="middle" />
      <Container>
        <Box component="section" p={2} display="flex" justifyContent="center">
          <ToggleButtonGroup
            value={category}
            fullWidth
            exclusive
            color="primary"
            onChange={handleCategory}
            aria-label="category"
            sx={{ width: "70%" }}
          >
            <ToggleButton value="" className="text text-white" aria-label="all">
              전체
            </ToggleButton>
            <ToggleButton
              value="공지사항"
              className="text text-white"
              aria-label="notice"
            >
              공지사항
            </ToggleButton>
            <ToggleButton
              value="홍보"
              className="text text-white"
              aria-label="advertisement"
            >
              홍보
            </ToggleButton>
            <ToggleButton
              value="소통"
              className="text text-white"
              aria-label="communication"
            >
              소통
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {articles.length === 0 && (
          <div className="flex justify-center">
            <h2 className="text-primary-dark dark:text-primary">
              등록된 게시글이 없습니다.
            </h2>
          </div>
        )}

        {articles.map((article: any) => {
          return (
            <Box
              key={article.id}
              p={2}
              style={{ position: "relative", zIndex: 0 }}
            >
              <Modal
                isOpen={editModalOpenMap.get(article.id) ?? false}
                onChange={() => handleEditModalClose(article.id)}
                title="글 수정하기"
              >
                <EditArticle
                  onClose={() => handleEditModalClose(article.id)}
                  article={article}
                  articleImages={articleImages.get(article.id) ?? null}
                />
              </Modal>

              <Card sx={{ maxWidth: 750, p: 1, margin: "0 auto" }}>
                <CardHeader
                  avatar={
                    <ProfileButton
                      onClick={() => router.push(`/${username}`)}
                      className="w-10 h-10"
                      profileImageUrl={article.userProfile}
                    ></ProfileButton>
                  }
                  action={
                    userInfos.username === username && (
                      <>
                        <IconButton
                          id="delete-button"
                          onClick={() => deleteArticle(article.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <IconButton
                          id="edit-button"
                          onClick={() => handleEditModalOpen(article.id)}
                        >
                          <EditIcon />
                        </IconButton>
                      </>
                    )
                  }
                  title={username}
                  subheader={article.createDate}
                />

                <Carousel>
                  {articleImages.has(article.id) &&
                    articleImages
                      .get(article.id)
                      .map((image: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-center"
                        >
                          <Paper elevation={0}>
                            <Image
                              height={450}
                              width={450}
                              src={image}
                              alt="Paella dish"
                            />
                          </Paper>
                        </div>
                      ))}
                </Carousel>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {article.content}
                  </Typography>
                </CardContent>
                <Comments _articleId={article.id} />
              </Card>
            </Box>
          );
        })}
        <Box display="flex" justifyContent="center">
          <Pagination
            count={totalPages}
            color="primary"
            variant="outlined"
            size="large"
            shape="rounded"
            page={currentPage}
            onChange={handlePage}
            sx={{
              "& .MuiPaginationItem-root": {
                color: "#fff",
              },
              "& .MuiPaginationItem-page.Mui-selected": {
                backgroundColor: "#3f51b5",
              },
            }}
          />
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default ArticleList;
