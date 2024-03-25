"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import {
  Box,
  Button,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  createTheme,
} from "@mui/material";
import React from "react";
import axiosClient from "@/libs/axiosClient";
import { ThemeProvider } from "@emotion/react";

interface Props {
  username: string;
  loadArticles: (category: string) => Promise<void>;
}

export default function ArticleForm({ username, loadArticles }: Props) {
  const router = useRouter();
  const artistUsername = username;
  const [category, setCategory] = React.useState("");
  const [content, setContent] = React.useState("");
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleCategory = (event: SelectChangeEvent) => {
    setCategory(event.target.value as string);
  };

  const handleContent = (event: any) => {
    setContent(event.target.value as string);
  };

  const updateImagePreviews = (files: FileList) => {
    const previews: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = () => {
        previews.push(reader.result as string);
        if (previews.length === files.length) {
          setImagePreviews(previews);
        }
      };
      reader.readAsDataURL(files[i]);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setImageFiles(event.target.files);
      updateImagePreviews(event.target.files);
    }
  };

  useEffect(() => {
    const handleSubmit = async (event: any) => {
      event.preventDefault();

      try {
        const articleResponse = await axiosClient.post(`/community/articles`, {
          category,
          content,
          artistUsername,
        });

        const articleResp = await articleResponse.data;

        const articleId = articleResp.data.articleId;

        if (imageFiles && imageFiles.length > 0) {
          const formData = new FormData();
          for (let i = 0; i < imageFiles.length; i++) {
            formData.append("file", imageFiles[i]);
          }
          formData.append("articleId", articleId.toString());
          try {
            await axiosClient.post("/community/articles/images", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
          } catch (error) {
            console.error(error);
          }
        }

        toast.success("글 작성 성공");

        setImageFiles(null);
        setImagePreviews([]);
        setContent("");
        setCategory("");

        loadArticles("");

        await router.push(`/${username}/community`);
      } catch (error) {
        console.error("글 작성 오류:", error);
      }
    };

    const form: any = document.getElementById("articleForm");
    form.addEventListener("submit", handleSubmit);

    return () => {
      form.removeEventListener("submit", handleSubmit);
    };
  }, [router, username, imageFiles, artistUsername, content, category, loadArticles]);

  const theme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Card
          sx={{ maxWidth: 750, p: 1, margin: "0 auto" }}
          style={{ position: "relative", zIndex: 0 }}
        >
          <form id="articleForm">
            <div className="mt-5">
              <Box sx={{ minWidth: 120 }}>
                <FormControl sx={{ width: 300, margin: 1 }}>
                  <InputLabel id="demo-simple-select-label">
                    카테고리
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={category}
                    label="Category"
                    onChange={handleCategory}
                  >
                    <MenuItem value={"공지사항"}>공지사항</MenuItem>
                    <MenuItem value={"홍보"}>홍보</MenuItem>
                    <MenuItem value={"소통"}>소통</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <FormControl sx={{ width: 600, margin: 1 }}>
                <TextField
                  color="warning"
                  id="content"
                  name="content"
                  label="내용"
                  multiline
                  rows={4}
                  value={content}
                  onChange={handleContent}
                  defaultValue="내용을 입력하세요"
                />
              </FormControl>
            </div>
            <div>
              <input
                type="hidden"
                name="artistUsername"
                id="artistUsername"
                value={username}
              />
            </div>
            <Box margin={1}>
              <input
                className="ms-3"
                type="file"
                id="imageUpload"
                name="imageUpload"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                style={{ display: 'none' }} 
              />
              <label htmlFor="imageUpload">
                <Button
                  variant="outlined"
                  color="primary"
                  component="span"
                >
                  사진 첨부
                </Button>
              </label>
            </Box>
            <div className="flex items-center">
              {imagePreviews.map((preview, index) => (
                <Box key={index} margin={1}>
                  <Image
                    src={preview}
                    width={200}
                    height={200}
                    alt={`Image ${index + 1}`}
                  />
                </Box>
              ))}
            </div>
            <Box margin={1}>
              <Button variant="outlined" color="warning" type="submit">
                작성완료
              </Button>
            </Box>
          </form>
        </Card>
      </div>
    </ThemeProvider>
  );
}
