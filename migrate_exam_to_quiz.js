import fs from "fs";
const DOMAIN = `http://127.0.0.1:1337`;

// const data = {
//   name: "ĐỀ KIỂM TRA GIỮA HỌC KỲ I",
//   description: "ĐỀ KIỂM TRA GIỮA HỌC KỲ I",
//   duration: 90,
//   grade: 9,
//   subject: 1,
//   type: "GK1",
//   school: 12597,
//   schoolYear: "2023-2024",
//   questionNo: 10,
// };

// const questionData = {
//   content: `<p>
//   Cho hàm số <img src="https://docdn.giainhanh.io/media/exams/v1/images/image_4_0_246_104_e7dc42a5d4b0e05468004e72f503c13a_e5dcbe219459466e8604e5c8fef910251677208006.jpeg">. Tìm tất cả các giá trị của tham số thực <img src="https://docdn.giainhanh.io/media/exams/v1/images/image_254_0_26_22_e7dc42a5d4b0e05468004e72f503c13a_e5dcbe219459466e8604e5c8fef910251677208006.jpeg"> để hàm số liên tục tại <img src="https://docdn.giainhanh.io/media/exams/v1/images/image_284_0_56_28_e7dc42a5d4b0e05468004e72f503c13a_e5dcbe219459466e8604e5c8fef910251677208006.jpeg">.
// </p>`,
//   answer: 1,
//   quiz: 824,
//   Options: [
//     { content: "a" },
//     { content: "b" },
//     { content: "c" },
//     { content: "d" },
//   ],
// };

const correctAnswer = {
  labelA: 1,
  labelB: 2,
  labelC: 3,
  labelD: 4,
};

const term = {
  "Giữa kỳ I": "GK1",
  "Cuối kỳ I": "CK1",
  "Giữa kỳ II": "GK2",
  "Cuối kỳ II": "CK2",
  "Thi vào lớp 10": "THI_VAO_10",
  "Thi THPT": "THI_THPT",
  "Thi học sinh giỏi": "THI_HSG",
  "Chất lượng đầu năm": "KSCLDN",
  "Đánh giá năng lực": "DGNL",
  "Ôn tập chương": "OTC",
};

const createQuiz = async (data) => {
  const url = `${DOMAIN}/api/quizzes`;

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data }),
  })
    .then((resp) => resp.json())
    .catch((err) => {
      return { err };
    });
};

const createQuestion = async (question) => {
  const url = `${DOMAIN}/api/questions`;
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: question }),
  })
    .then((resp) => resp.json())
    .catch((err) => {
      return { err };
    });
};

const getPaperExamById = async (id) => {
  const url = `${DOMAIN}/api/paper-exams/${id}?populate=*`;
  return fetch(url)
    .then((resp) => resp.json())
    .catch((err) => {
      return { err };
    });
};

const cleanExamData = (paperExam) => {
  const data = {
    name: paperExam.title,
    description: paperExam.title,
    duration: paperExam.duration,
    grade: paperExam.grade.id,
    subject: paperExam.subject.id,
    type: term[paperExam.examTerm],
    school: paperExam.school.id,
    schoolYear: paperExam.schoolYear,
  };

  const questions = paperExam.relatedItems.filter(
    (item) => item.__component === "exam.single-quiz",
  );

  // data.questions = questions;
  data.questionNo = questions.length;

  return data;
};

const cleanQuestionData = (questionData, quizId) => {
  const data = {
    content: `<p><b>${questionData.title}</b> ${questionData.questionContent}</p>`,
    answer: correctAnswer[questionData.correctLabel],
    quiz: quizId,
    Options: [
      { content: questionData.labelA },
      { content: questionData.labelB },
      { content: questionData.labelC },
      { content: questionData.labelD },
    ],
    Explanation: questionData.longAnswer ?? questionData.shortAnswer ?? "",
  };

  return data;
};

const cleanQuestionList = (paperExam, quizId) => {
  return paperExam.relatedItems
    .filter((item) => item.__component === "exam.single-quiz")
    .map((question) => cleanQuestionData(question, quizId));
};

const main = async () => {
  try {
    const paperExam = await getPaperExamById(1);
    const quizData = cleanExamData(paperExam.data);
    const quizCreated = await createQuiz(quizData);

    const questions = cleanQuestionList(paperExam.data, quizCreated.data.id);

    for (let i = 0; i < questions.length; i++) {
      await createQuestion(questions[i]);
    }
  } catch (error) {
    console.log(error);
  }
};

main();
