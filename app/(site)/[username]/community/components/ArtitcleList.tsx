"use client";
import { GetCookie } from "@/libs/auth";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import axiosClient from "@/libs/axiosClient";
import Image from "next/image";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Container,
  IconButton,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import React from "react";
import Carousel from "react-material-ui-carousel";
import ProfileButton from "@/components/ProfileButton";
import { useRouter } from "next/navigation";
import Comments from "./Comments";

interface Props {
  username: string;
}

const ArticleList = ({ username }: Props) => {
  const [articles, setArticles] = useState([]);
  const [articleImages, setArticleImages] = useState(new Map());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = React.useState<string>("");
  const router = useRouter();

  useEffect(() => {
    loadArticles("");
  }, []);

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
      console.log(articleImages);
      setArticles(data.data.articleList.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      const errorObj = error as Error;
      toast.error(`게시글을 불러오는 데 실패하였습니다. (${errorObj.message})`);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newCategory: string
  ) => {
    setCategory(newCategory);
    loadArticles(newCategory);
  };

  return (
    <Container>
      <Box component="section" p={2} display="flex" justifyContent="center">
        <ToggleButtonGroup
          value={category}
          fullWidth
          exclusive
          color="primary"
          onChange={handleAlignment}
          aria-label="cagtegory"
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

      {articles.map((article: any) => (
        <Box key={article.id} p={2}>
          <Card sx={{ maxWidth: 750, p: 1, margin: "0 auto" }}>
            <CardHeader
              avatar={
                <ProfileButton
                  onClick={() => router.push(`/${username}`)}
                  className="w-10 h-10"
                  profileImageUrl={article.userProfile}
                ></ProfileButton>
              }
              action={<IconButton aria-label="settings"></IconButton>}
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
      ))}

      <div className="join flex justify-center">
        {totalPages > 0 && (
          <button
            className="join-item btn btn-square"
            onClick={handlePreviousPage}
          >
            이전 페이지
          </button>
        )}
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (pageNumber) => (
            <button
              key={pageNumber}
              className={`join-item btn btn-square ${
                pageNumber === currentPage ? "btn-active" : ""
              }`}
              onClick={() => setCurrentPage(pageNumber)}
            >
              {pageNumber}
            </button>
          )
        )}
        {totalPages > currentPage && (
          <button className="join-item btn btn-square" onClick={handleNextPage}>
            다음 페이지
          </button>
        )}
      </div>
    </Container>
  );
};

export default ArticleList;
