import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
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
} from "@mui/material";
import Image from "next/image";
import axiosClient from "@/libs/axiosClient";
import toast from "react-hot-toast";

interface Props {
  article: any;
  onClose: () => void;
  articleImages: any;
}

const EditArticle = ({ article, onClose, articleImages }: Props) => {
  const [category, setCategory] = React.useState(article.category);
  const [content, setContent] = React.useState(article.content);
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>(articleImages);

  const handleCategory = (event: SelectChangeEvent) => {
    setCategory(event.target.value as string);
  };

  const handleContent = (event: any) => {
    setContent(event.target.value as string);
  };

  const updateImagePreviews = (files: FileList) => {
    const previews: string[] = [...imagePreviews]; // 기존 이미지 미리보기 복사

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = () => {
        previews.push(reader.result as string); // 새로운 이미지 미리보기에 추가
        if (previews.length === files.length + imagePreviews.length) {
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

  const editArticle = async () => {
    try {
      const response = await axiosClient.put(
        `/community/articles/${article.id}`,
        { category, content }
      );

      if (imageFiles && imageFiles.length > 0) {
        const formData = new FormData();
        for (let i = 0; i < imageFiles.length; i++) {
          formData.append("file", imageFiles[i]);
        }
        formData.append("articleId", article.id.toString());

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

      toast.success("글을 수정하였습니다.");
      onClose();
    } catch (error) {
      toast.error("글 수정에 실패하였습니다.");
    }
  };

  const deleteImage = (imageUrl: string) => {
    if (!imageUrl.startsWith("data:")) {
      // 기존에 서버에 등록된 이미지인 경우
      const fileName = imageUrl.split("/").slice(-1)[0].split("?")[0];
      axiosClient
        .delete(`/community/articles/images/${fileName}`)
        .then(() => {
          setImagePreviews((prevPreviews) =>
            prevPreviews.filter((prevPreview) => prevPreview !== imageUrl)
          );
          toast.success("이미지가 삭제되었습니다.");
        })
        .catch((error) => {
          toast.error("이미지 삭제에 실패하였습니다.");
        });
    } else {
      // 새로 추가한 이미지인 경우
      setImagePreviews((prevPreviews) =>
        prevPreviews.filter((prevPreview) => prevPreview !== imageUrl)
      );
    }
  };

  return (
    <div>
      <Card variant="outlined" sx={{ maxWidth: 750, p: 1, margin: "0 auto" }}>
        <div className="mt-5">
          <Box sx={{ minWidth: 120 }}>
            <FormControl sx={{ width: 300, margin: 1 }}>
              <InputLabel id="demo-simple-select-label">카테고리</InputLabel>
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
            className="ms-3"
            type="file"
            id="imageUpload"
            name="imageUpload"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
        </div>
        <div className="flex items-center">
          {imagePreviews.map((preview, index) => (
            <div key={index} style={{ position: "relative" }}>
              <Image
                src={preview}
                width={200}
                height={200}
                alt={`Image ${index + 1}`}
              />
              <Button
                variant="contained"
                color="error"
                size="small"
                sx={{ position: "absolute", top: 0, right: 0, color: "black" }}
                onClick={() => deleteImage(preview)}
              >
                X
              </Button>
            </div>
          ))}
        </div>
        <div className="flex items-center mt-5">
          <Button
            variant="contained"
            sx={{ color: "primary.main" }}
            onClick={editArticle}
          >
            수정하기
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default EditArticle;
