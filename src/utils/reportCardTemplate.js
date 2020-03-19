import { logo } from './logo';

const Head = sapId => `
    <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>${sapId}</title>
    <style>
      .logo svg {
        width: 100%;
        margin: 10px auto;
      }
      .grid {
        display: grid;
        grid-template-columns: 1fr;
        padding: 10px auto;
      }
      .question {
        display: inline-block;
        width: 100%;
        padding: 5px;
      }
      .incorrect {
        background: rgb(241, 123, 123, 0.5);
      }
      .code {
        background: rgba(229, 229, 229, 0.5);
      }
    </style>
  </head>
`;

const extractMarks = (id, paperObjCode) => {
  let marks = 0;
  for (let i = 0; i < paperObjCode.length; i++) {
    if (String(paperObjCode[i]['questionId']) === String(id)) {
      marks = paperObjCode[i]['marks'];
    }
  }
  return marks;
};

const MCQ = (mcq, paperObjMCQ) => {
  const doc = mcq.map((question, index) => {
    const title = question['questionId']['title'];

    const selected =
      question['optionsSelected'] !== ' '
        ? question['optionsSelected']
        : 'Not Attempted';

    const correctAnswer = question['questionId']['correctAnswers'][0];

    const id = question['questionId']['_id'];
    const total = extractMarks(id, paperObjMCQ);

    if (question['marks'] !== 0) {
      return `
      <div class="question">
        <p>Q ${index + 1}. <pre><code>${title}</code></pre></p>
        <p><pre><code>Answer : ${selected}</code></pre></p>
        <p><pre><code>Correct Answer : ${correctAnswer}</code></pre></p>
        <p><pre><code>Marks: ${
          question['marks']
        } / ${total}</code></pre></p>
      </div>
        `;
    } else {
      return `
      <div class="question incorrect">
      <p><pre><code>${title}</code></pre></p>
      <p><pre><code>Answer : ${selected}</code></pre></p>
      <p><pre><code>Correct Answer : ${correctAnswer}</code></pre></p>
        <p><pre><code>Marks: ${question['marks']} / ${total}</code></pre></p>
      </div>
        `;
    }
  });
  return doc.join('');
};

const Code = (code, paperObjCode) => {
  const doc = code.map((question, index) => {
    const title = `Q ${index + 1}. ${
      question['questionId']['title']
    }`;

    const output =
      question['output'] !== undefined
        ? question['output']
        : 'No Output';

    let program =
      question['program'] !== null ? question['program'] : '';
    if (program.indexOf('<') !== -1) {
      program = program.split('<').join('&#60');
    }
    if (program.indexOf('>') !== -1) {
      program = program.split('>').join('&#62');
    }

    const id = question['questionId']['_id'];
    const total = extractMarks(id, paperObjCode);

    return `
    <div class="question code">
      <p><pre><code>${title}</code></pre></p>
      <p><pre><code>${program}</code></pre></p>
      <hr />
      <p><pre><code>${output}</code></pre></p>
      <hr />
      <p>Marks: ${question['marks']} / ${total}</p>
    </div>
    `;
  });
  return doc.join('');
};

export const reportCardTemplate = selectedAnswers => {
  const { sapId } = selectedAnswers['studentId'];
  const {
    set,
    time,
    type,
    year,
    code: paperObjCode,
    mcq: paperObjMCQ,
  } = selectedAnswers['paperId'];
  const {
    mcq,
    code,
    mcqMarksObtained,
    mcqTotalMarks,
    codeMarksObtained,
    codeTotalMarks,
  } = selectedAnswers;

  const totalMarks = mcqTotalMarks + codeTotalMarks;
  const marksObtained = mcqMarksObtained + codeMarksObtained;

  return `
    <!DOCTYPE html>
    <html lang="en">
    ${Head(sapId)}
    <body>
    <div class="logo">${logo}</div>
    <div>SAP ID : ${sapId}</div>
    <hr />
    <div>SET : ${set}</div>
    <hr />
    <div>Type : ${type}</div>
    <hr />
    <div>Year : ${year}</div>
    <hr />
    <div>Test duration : ${time / 60} min</div>
    <hr />
    <div>Total marks : ${marksObtained} / ${totalMarks}</div>
    <hr />
    <div class="grid">
      <div>M C Q SECTION</div>
      <div></div>
      <hr />
      <div>Marks : ${mcqMarksObtained} / ${mcqTotalMarks}</div>
      <hr />
      <div>${MCQ(mcq, paperObjMCQ)}</div>
    </div>
    <hr />
    <div class="grid">
      <div>C O D E SECTION</div>
      <div></div>
      <hr />
      <div>Marks : ${codeMarksObtained} / ${codeTotalMarks}</div>
      <hr />
      <div>${Code(code, paperObjCode)}</div>
    </div>
    `;
};
