"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GetCookie } from "@/libs/auth";
import toast from "react-hot-toast";
import Image from "next/image";

interface Props {
  username: string;
}

export default function ArticleForm({ username }: Props) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    category: "",
    content: "",
    artistUsername: username, // 초기값으로 받아온 username 사용
  });
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
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
      const accessToken = GetCookie("accessToken");

      if (!accessToken) {
        toast.error("로그인 해주세요.");
        return;
      }

      try {
        const articleResponse = await fetch(
          `http://localhost:8090/community/articles`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${accessToken}`,
            },
            body: JSON.stringify(formData),
          }
        );
        const articleResp = await articleResponse.json();

        if (!articleResponse.ok) {
          toast.error(articleResp.message);
          return;
        }

        const articleId = articleResp.data.articleId;

        if (imageFiles && imageFiles.length > 0) {
          const formData = new FormData();
          for (let i = 0; i < imageFiles.length; i++) {
            formData.append("file", imageFiles[i]);
          }
          formData.append("articleId", articleId.toString());
          try {
            await fetch(`http://localhost:8090/community/articles/images`, {
              method: "POST",
              credentials: "include",
              headers: {
                Authorization: `${accessToken}`,
              },
              body: formData,
            });
          } catch (error) {
            console.error(error);
          }
        }

        toast.success("글 작성 성공");
        setFormData({
          category: "",
          content: "",
          artistUsername: username,
        });
        setImageFiles(null);
        setImagePreviews([]);

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
  }, [router, username, formData, imageFiles]);

  return (
    <div className="container bg-gray-light dark:bg-gray-800 w-full">
      <div className="card card-body">
        <form id="articleForm">
          <div className="mt-5">
            <select
              className="select select-bordered w-full max-w-xs text-primary-dark dark:text-primary bg-base-200 dark:bg-gray-600 ms-3"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
            >
              <option value="" disabled defaultValue={''}>
                카테고리를 선택하세요
              </option>
              <option value="공지사항">공지사항</option>
              <option value="홍보">홍보</option>
              <option value="소통">소통</option>
            </select>
          </div>
          <div className="flex items-center mt-5">
            <textarea
              className="textarea textarea-bordered w-8/12 text-primary-dark dark:text-primary bg-base-200 dark:bg-gray-600 ms-3"
              name="content"
              id="content"
              placeholder="내용을 입력하세요"
              required
              value={formData.content}
              onChange={handleChange}
            />
            <input
              type="hidden"
              name="artistUsername"
              id="artistUsername"
              value={username}
            />
          </div>
          <div className="mt-5">
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
            <div key={index}>
              <Image src={preview} width={200} height={200} alt={`Image ${index + 1}`} />
            </div>
          ))}
          </div>
          <div className="flex items-center mt-5">
            <button
              className="btn dark:btn-primary hover:btn-primary dark:hover:btn-ghost ms-3"
              type="submit"
            >
              작성완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
