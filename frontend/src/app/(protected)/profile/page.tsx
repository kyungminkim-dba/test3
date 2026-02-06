/**
 * 프로필 페이지
 * - 사용자 정보 표시
 * - 프로필 수정 기능
 * - 계정 관리
 */

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/lib/hooks/use-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Calendar, AlertTriangle } from "lucide-react";

// 프로필 수정 스키마
const profileSchema = z.object({
  username: z
    .string()
    .min(3, "사용자명은 최소 3자 이상이어야 합니다")
    .max(50, "사용자명은 최대 50자까지 가능합니다")
    .optional(),
  email: z
    .string()
    .email("올바른 이메일 형식이 아닙니다")
    .optional(),
  current_password: z
    .string()
    .min(1, "현재 비밀번호를 입력해주세요")
    .optional(),
  new_password: z
    .string()
    .min(8, "비밀번호는 최소 8자 이상이어야 합니다")
    .optional()
    .or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, updateProfile, isUpdatingProfile, deleteAccount, isDeletingAccount } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      current_password: "",
      new_password: "",
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    // 빈 문자열 제거
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== "")
    );

    updateProfile(cleanData);
    setIsEditing(false);
    form.reset();
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
      )
    ) {
      deleteAccount();
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-3xl space-y-8">
        {/* 헤더 */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">프로필</h1>
          <p className="text-muted-foreground">
            계정 정보를 확인하고 수정할 수 있습니다.
          </p>
        </div>

        {/* 기본 정보 카드 */}
        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
            <CardDescription>
              현재 등록된 계정 정보입니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <User className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">사용자명</p>
                <p className="text-sm text-muted-foreground">{user.username}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">이메일</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">가입일</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(user.created_at).toLocaleString("ko-KR")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 프로필 수정 카드 */}
        <Card>
          <CardHeader>
            <CardTitle>프로필 수정</CardTitle>
            <CardDescription>
              사용자명, 이메일, 비밀번호를 변경할 수 있습니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>수정하기</Button>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>사용자명</FormLabel>
                        <FormControl>
                          <Input placeholder={user.username} {...field} />
                        </FormControl>
                        <FormDescription>
                          새로운 사용자명을 입력하세요 (선택사항)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>이메일</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder={user.email}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          새로운 이메일 주소를 입력하세요 (선택사항)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <FormField
                    control={form.control}
                    name="current_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>현재 비밀번호</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="변경 시 필수"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          정보 변경 시 현재 비밀번호가 필요합니다
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="new_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>새 비밀번호</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="변경 시에만 입력"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          비밀번호를 변경하려면 새 비밀번호를 입력하세요
                          (선택사항)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-4">
                    <Button type="submit" disabled={isUpdatingProfile}>
                      {isUpdatingProfile ? "저장 중..." : "저장"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        form.reset();
                      }}
                    >
                      취소
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>

        {/* 위험 구역 */}
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              위험 구역
            </CardTitle>
            <CardDescription>
              계정 삭제는 되돌릴 수 없습니다. 신중히 진행해주세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isDeletingAccount}
            >
              {isDeletingAccount ? "삭제 중..." : "계정 삭제"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
