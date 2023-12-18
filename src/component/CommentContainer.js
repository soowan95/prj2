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
  Center,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  faAngleLeft,
  faAngleRight,
  faPenToSquare,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoginProvider, { LoginContext } from "./LoginProvider";
import { NotAllowedIcon } from "@chakra-ui/icons";
import { useNavigate, useSearchParams } from "react-router-dom";

function CommentForm({ songId, isSubmitting, onSubmit }) {
  const [comment, setComment] = useState("");

  function handleSubmit() {
    onSubmit({ songId, comment });

    // 제출 후 댓글 입력 초기화
    setComment("");
  }

  return (
    <Box
      w={{ base: "100%", md: "1200px" }}
      style={{ position: "sticky", top: 0, zIndex: 1 }}
    >
      <Card bg="transparent" style={{ position: "sticky" }}>
        <CardHeader mt={30}>
          <Heading ml={30} size={"md"}>
            댓글
          </Heading>
        </CardHeader>
        <CardBody>
          <Flex align="center" justify="center">
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
        </CardBody>
      </Card>
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

  // 댓글 수정 제출 핸들러
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
          {/* 댓글 작성자(닉네임)와 작성일 */}
          <Heading size="xs">{comment.memberNickName}</Heading>
          <Text fontSize="xs">{comment.inserted}</Text>
        </Flex>
        <Flex justifyContent="space-between" alignItems="center">
          {/* 댓글 편집 모드일 때 */}
          {isEditing ? (
            <Box justifyContent="space-between" alignItems="center" w="100%">
              {/* 기존 댓글 내용 */}
              <Text
                sx={{ whiteSpace: "pre-wrap" }}
                pt="2"
                fontSize="sm"
                marginBottom={"10px"}
              >
                {comment.comment}
              </Text>
              <Flex justifyContent="space-between" alignItems="center" w="100%">
                {/* 댓글 수정 부분 */}
                <Textarea
                  value={commentEdited}
                  onChange={(e) => setCommentEdited(e.target.value)}
                  w={"100%"}
                />
                {/* 취소 버튼 */}
                <Button
                  size="sm"
                  colorScheme="gray"
                  onClick={() => setIsEditing(false)}
                >
                  <NotAllowedIcon />
                </Button>
                {/* 수정 완료 버튼 */}
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
            // 댓글 편집 모드가 아닐 경우
            <Box w="80%">
              {/* 댓글 내용 */}
              <Text sx={{ whiteSpace: "pre-wrap" }} pt="2" fontSize="sm">
                {comment.comment}
              </Text>
            </Box>
          )}

          {/* 댓글 작성자가 권한이 있을 경우에만 수정, 삭제 버튼 보이게 */}
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

function PageButton({ variant, pageNumber, children, setPage }) {
  function handleClick() {
    setPage(pageNumber);
  }

  return (
    <Button variant={variant} onClick={handleClick}>
      {children}
    </Button>
  );
}

function CommentList({
  commentList,
  onDeleteModalOpen,
  isSubmitting,
  setIsSubmitting,
  pageInfo,
  setPage,
}) {
  const { hasAccess } = useContext(LoginContext);

  const pageNumbers = [];

  for (let i = pageInfo.startPageNo; i <= pageInfo.endPageNo; i++) {
    pageNumbers.push(i);
  }

  return (
    // Box를 추가하여 Card를 감싸고, position 속성을 사용하여 왼쪽에 고정
    <Box width="100%">
      <Card bg="transparent" borderWidth="0">
        <CardHeader mt={30}>
          <Heading ml={30} size={"md"}>
            댓글 리스트
          </Heading>
        </CardHeader>
        <CardBody>
          {/* maxWidth 속성을 추가하여 최대 너비를 설정 */}
          <Box minWidth="1000px" mx="auto">
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
          </Box>
        </CardBody>
      </Card>
      <Center mt={5} mb={10}>
        <Box>
          {pageInfo.prevPageNumber && (
            <PageButton
              setPage={setPage}
              variant="ghost"
              pageNumber={pageInfo.prevPageNumber}
            >
              <FontAwesomeIcon icon={faAngleLeft} />
            </PageButton>
          )}

          {pageNumbers.map((pageNumber) => (
            <PageButton
              key={pageNumber}
              variant={
                pageNumber === pageInfo.currentPageNumber ? "solid" : "ghost"
              }
              pageNumber={pageNumber}
              setPage={setPage}
            >
              {pageNumber}
            </PageButton>
          ))}

          {pageInfo.nextPageNumber && (
            <PageButton
              setPage={setPage}
              variant="ghost"
              pageNumber={pageInfo.nextPageNumber}
            >
              <FontAwesomeIcon icon={faAngleRight} />
            </PageButton>
          )}
        </Box>
      </Center>
    </Box>
  );
}

export function CommentContainer({ songId }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentList, setCommentList] = useState([]);
  const [pageInfo, setPageInfo] = useState([]);
  const [page, setPage] = useState(1);

  const { isOpen, onClose, onOpen } = useDisclosure();

  // useRef : 컴포넌트에서 임시로 값을 저장하는 용도로 사용
  const commentIdRef = useRef(0);

  const { isAuthenticated } = useContext(LoginContext);

  const toast = useToast();

  useEffect(() => {
    if (!isSubmitting) {
      const params = new URLSearchParams();
      params.set("id", songId);

      // 댓글 목록 불러오기
      axios
        .get("/api/comment/list?" + params + "&p=" + page)
        .then((response) => {
          setCommentList(response.data.commentList);
          setPageInfo(response.data.pageInfo);
        });
    }
  }, [isSubmitting, page]);

  // 댓글 작성 핸들러
  function handleSubmit(comment) {
    setIsSubmitting(true);

    // 댓글 추가 요청
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

  // 댓글 삭제 핸들러
  function handleDelete() {
    setIsSubmitting(true);

    // 댓글 삭제 요청
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
      {/* 댓글 리스트 표시 */}
      <CommentList
        songId={songId}
        commentList={commentList}
        setIsSubmitting={setIsSubmitting}
        isSubmitting={isSubmitting}
        onDeleteModalOpen={handleDeleteModalOpen}
        pageInfo={pageInfo}
        setPage={setPage}
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
