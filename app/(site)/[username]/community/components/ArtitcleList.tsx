"use client";
import { GetCookie } from "@/libs/auth";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import axiosClient from "@/libs/axiosClient";
import Image from "next/image";

interface Props {
  username: string;
}

const ArticleList = ({ username }: Props) => {
  const [articles, setArticles] = useState([]);
  const [articleImages, setArticleImages] = useState(new Map());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedButton, setSelectedButton] = useState("");
  const [currentCategory, setCurrentCategory] = useState("");

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

  const selectButton = (category: any) => {
    setSelectedButton(category);
    setCurrentCategory(category);
    loadArticles(category);
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

  return (
    <div className="container my-4 space-y-4">
      <div className="flex justify-center">
        <button
          className="btn dark:btn-primary hover:btn-primary dark:hover:btn-ghost w-2/12 {selectedButton ===
			''
				? 'btn-disabled'
				: ''}"
          onClick={() => selectButton("")}
        >
          전체
        </button>
        <div className="divider divider-horizontal" />
        <button
          className="btn dark:btn-primary hover:btn-primary dark:hover:btn-ghost w-2/12 {selectedButton ===
			'공지사항'
				? 'btn-disabled'
				: ''}"
          onClick={() => selectButton("공지사항")}
        >
          공지사항
        </button>
        <div className="divider divider-horizontal" />
        <button
          className="btn dark:btn-primary hover:btn-primary dark:hover:btn-ghost w-2/12 {selectedButton ===
			'홍보'
				? 'btn-disabled'
				: ''}"
          onClick={() => selectButton("홍보")}
        >
          홍보
        </button>
        <div className="divider divider-horizontal" />
        <button
          className="btn dark:btn-primary hover:btn-primary dark:hover:btn-ghost w-2/12 {selectedButton ===
			'소통'
				? 'btn-disabled'
				: ''}"
          onClick={() => selectButton("소통")}
        >
          소통
        </button>
      </div>

      {articles.length === 0 && (
        <div className="flex justify-center">
          <h2 className="text-primary-dark dark:text-primary">
            등록된 게시글이 없습니다.
          </h2>
        </div>
      )}

      {articles.map((article: any) => (
        <div
          key={article.id}
          className="card w-auto bg-gray-light dark:bg-gray-800 shadow-xl"
        >
          {article.content}
          <div className="flex items-center">
            {articleImages.has(article.id) &&
              articleImages
                .get(article.id)
                .map((image: any, index: number) => (
                  <Image
                    key={index}
                    src={image}
                    width={300}
                    height={300}
                    alt={"picture"}
                  />
                ))}
          </div>
        </div>
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
    </div>
  );
};

export default ArticleList;
