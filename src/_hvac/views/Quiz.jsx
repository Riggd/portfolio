import { useState } from 'react';

import { QUIZ } from '../data/quiz.js';

/*
Answer-immediately quiz. Showing the explanation the moment a
choice is made — right or wrong — teaches more than a score at
the end, so there is no submit button and no timer.
*/

export function Quiz() {
    const [answers, setAnswers] = useState({});

    const choose = (questionIndex, optionIndex) => {
        if (answers[questionIndex] !== undefined) return; /* one shot per question */
        setAnswers({ ...answers, [questionIndex]: optionIndex });
    };

    const answered = Object.keys(answers).length;
    const correct = Object.entries(answers).filter(([index, choice]) => QUIZ[index].answer === choice).length;

    return (
        <div className="quiz">
            <div className="quiz__score">
                <p>
                    <strong>{correct}</strong> of {answered} correct
                    {answered < QUIZ.length && <span className="muted"> · {QUIZ.length - answered} to go</span>}
                </p>
                {answered > 0 && (
                    <button type="button" className="button button--quiet" onClick={() => setAnswers({})}>
                        Start over
                    </button>
                )}
            </div>

            {QUIZ.map((item, questionIndex) => {
                const choice = answers[questionIndex];
                const isAnswered = choice !== undefined;

                return (
                    <section key={item.question} className="quiz__item">
                        <h3>
                            <span className="quiz__number">{questionIndex + 1}</span>
                            {item.question}
                        </h3>

                        <ul className="quiz__options">
                            {item.options.map((option, optionIndex) => {
                                const isCorrect = optionIndex === item.answer;
                                const isChosen = optionIndex === choice;

                                let state = 'idle';
                                if (isAnswered && isCorrect) state = 'correct';
                                else if (isChosen) state = 'wrong';

                                return (
                                    <li key={option}>
                                        <button
                                            type="button"
                                            className={`quiz__option quiz__option--${state}`}
                                            onClick={() => choose(questionIndex, optionIndex)}
                                            disabled={isAnswered}
                                        >
                                            {option}
                                            {isAnswered && isCorrect && <span className="quiz__mark">correct</span>}
                                            {isChosen && !isCorrect && <span className="quiz__mark">your answer</span>}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>

                        {isAnswered && <p className="quiz__explanation">{item.explanation}</p>}
                    </section>
                );
            })}
        </div>
    );
}
