import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Stack,
  StackDivider,
  Textarea,
  Text,
  Flex,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoginProvider, { LoginContext } from "./LoginProvider";
import { NotAllowedIcon } from "@chakra-ui/icons";

function CommentForm({ songId, isSubmitting, onSubmit }) {
  const [comment, setComment] = useState("");

  function handleSubmit() {
    onSubmit({ songId, comment });

    // 제출 후 댓글 입력 초기화
    setComment("");
  }

  return (
    <Box>
      <Flex mt={70} align="center" justify="center">
        <Textarea
          w="70%"
          h={100}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button isDisabled={isSubmitting} onClick={handleSubmit} h={100}>
          작성
        </Button>
      </Flex>
    </Box>
  );
}

function CommentItem({
  comment,
  onDeleteModalOpen,
  setIsSubmitting,
  isSubmitting,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [commentEdited, setCommentEdited] = useState(comment.comment);

  const { hasAccess } = useContext(LoginContext);

  const toast = useToast();

  function handleSubmit() {
    setIsSubmitting(true);

    axios
      .put("/api/comment/edit", { id: comment.id, comment: commentEdited })
      .then(() => {
        toast({
          description: "댓글이 수정되었습니다.",
          status: "success",
        });
      })
      .catch((error) => {
        if (error.response.status === 401 || error.response.status === 403) {
          toast({
            description: "권한이 없습니다.",
            status: "warning",
          });
        }

        if (error.response.status === 400) {
          toast({
            description: "입력값을 확인해주세요.",
            status: "warning",
          });
        }
      })
      .finally(() => {
        setIsSubmitting(false);
        setIsEditing(false);
      });
  }

  return (
    <Flex justify="center">
      <Box w="90%" key={comment.id}>
        <Flex justifyContent="space-between" marginBottom={"10px"}>
          <Heading size="xs">{comment.memberNickName}</Heading>
          <Text fontSize="xs">{comment.inserted}</Text>
        </Flex>
        <Flex justifyContent="space-between" alignItems="center">
          {isEditing ? (
            <Box justifyContent="space-between" alignItems="center" w="100%">
              <Text
                sx={{ whiteSpace: "pre-wrap" }}
                pt="2"
                fontSize="sm"
                marginBottom={"10px"}
              >
                {comment.comment}
              </Text>
              <Flex justifyContent="space-between" alignItems="center" w="100%">
                <Textarea
                  value={commentEdited}
                  onChange={(e) => setCommentEdited(e.target.value)}
                  w={"100%"}
                  resize="vertical" // 선택사항: 세로 크기 조절을 허용합니다
                />
                <Button
                  size="sm"
                  colorScheme="gray"
                  onClick={() => setIsEditing(false)}
                >
                  <NotAllowedIcon />
                </Button>
                <Button
                  size="sm"
                  isDisabled={isSubmitting}
                  onClick={handleSubmit}
                >
                  수정
                </Button>
              </Flex>
            </Box>
          ) : (
            <Box w="80%">
              <Text sx={{ whiteSpace: "pre-wrap" }} pt="2" fontSize="sm">
                {comment.comment}
              </Text>
            </Box>
          )}

          {hasAccess(comment.memberId) && (
            <Box marginTop={"10px"}>
              {isEditing || (
                <Box>
                  <Button size="sm" onClick={() => setIsEditing(true)}>
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </Button>

                  <Button
                    onClick={() => onDeleteModalOpen(comment.id)}
                    size="sm"
                    colorScheme="purple"
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </Flex>
      </Box>
    </Flex>
  );
}

function CommentList({
  commentList,
  onDeleteModalOpen,
  isSubmitting,
  setIsSubmitting,
}) {
  const { hasAccess } = useContext(LoginContext);

  return (
    <Card>
      <CardHeader mt={50}>
        <Heading ml={30} size={"md"}>
          댓글 리스트
        </Heading>
      </CardHeader>
      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
          {commentList.map((comment) => (
            <CommentItem
              key={comment.id}
              isSubmitting={isSubmitting}
              setIsSubmitting={setIsSubmitting}
              comment={comment}
              onDeleteModalOpen={onDeleteModalOpen}
            />
          ))}
        </Stack>
      </CardBody>
    </Card>
  );
}

export function CommentContainer({ songId }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentList, setCommentList] = useState([]);

  const { isOpen, onClose, onOpen } = useDisclosure();

  // const [id, setId] = useState(0);
  // useRef : 컴포넌트에서 임시로 값을 저장하는 용도로 사용
  const commentIdRef = useRef(0);

  const { isAuthenticated } = useContext(LoginContext);

  const toast = useToast();

  useEffect(() => {
    if (!isSubmitting) {
      const params = new URLSearchParams();
      params.set("id", songId);

      axios
        .get("/api/comment/list?" + params)
        .then((response) => setCommentList(response.data));
    }
  }, [isSubmitting]);

  function handleSubmit(comment) {
    setIsSubmitting(true);

    axios
      .post("/api/comment/add", comment)
      .then(() => {
        toast({
          description: "댓글이 등록되었습니다.",
          status: "success",
        });
      })
      .catch((error) => {
        toast({
          description: "댓글 등록 중 문제가 발생하였습니다.",
          status: "error",
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  function handleDelete() {
    setIsSubmitting(true);
    axios
      .delete("/api/comment/" + commentIdRef.current)
      .then(() => {
        toast({
          description: "댓글이 삭제되었습니다.",
          status: "success",
        });
      })
      .catch((error) => {
        if (error.response.status === 401 || error.response.status === 403) {
          toast({
            description: "권한이 없습니다.",
            status: "warning",
          });
        } else {
          toast({
            description: "댓글 삭제 중 문제가 발생했습니다.",
            status: "error",
          });
        }
      })
      .finally(() => {
        onClose();
        setIsSubmitting(false);
      });
  }

  function handleDeleteModalOpen(id) {
    // id를 어딘가 저장
    // setId(id);
    commentIdRef.current = id;
    // 모달 열기
    onOpen();
  }
  return (
    <Box>
      {/* 로그인 한 경우에만 댓글 작성 버튼 생성 */}
      {isAuthenticated() && (
        <CommentForm
          songId={songId}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      )}
      <CommentList
        songId={songId}
        commentList={commentList}
        setIsSubmitting={setIsSubmitting}
        isSubmitting={isSubmitting}
        onDeleteModalOpen={handleDeleteModalOpen}
      />

      {/* 삭제 모달 */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>삭제 확인</ModalHeader>
          <ModalCloseButton />
          <ModalBody>삭제 하시겠습니까?</ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>닫기</Button>
            <Button
              isDisabled={isSubmitting}
              onClick={handleDelete}
              colorScheme="purple"
            >
              삭제
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
