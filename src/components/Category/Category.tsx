"use client";

import { useState, useEffect } from "react";
import { Category as CategoryType, Question } from "@/types";
import { QuestionsApi } from "@/api";
import styles from "./Category.module.css";

type CategoryProps = {
  slug: string;
  initialData?: CategoryType & { questions?: Question[] };
};

export default function Category({ slug, initialData }: CategoryProps) {
  const [category, setCategory] = useState<CategoryType & { questions?: Question[] } | null>(
    initialData || null
  );
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qIndex: number]: number }>({});
  const [results, setResults] = useState<{ [qIndex: number]: string }>({});

  useEffect(() => {
    if (!initialData) {
      async function fetchData() {
        const api = new QuestionsApi();
        const response = await api.getCategory(slug);
        if (response) {
          setCategory(response);
        } else {
          setError("Flokkur fannst ekki");
        }
      }
      fetchData();
    }
  }, [slug, initialData]);

  if (error || !category) return <p className={styles.error}>{error || "Flokkur fannst ekki"}</p>;

  const handleAnswerChange = (qIndex: number, aIndex: number) => {
    setSelectedAnswers(prev => ({ ...prev, [qIndex]: aIndex }));
  };

  const checkAnswer = (qIndex: number) => {
    if (!category?.questions || !category.questions[qIndex]) return;
    const question = category.questions[qIndex];
    const selectedIdx = selectedAnswers[qIndex];

    if (selectedIdx === undefined) {
      setResults(prev => ({ ...prev, [qIndex]: "Veldu svar." }));
      return;
    }

    setResults(prev => ({
      ...prev,
      [qIndex]: question.answers[selectedIdx].correct ? "Rétt svar!" : "Rangt svar!"
    }));
  };

  return (
    <div className={styles.categoryContainer}>
      <h1 className={styles.title}>{category.name}</h1>
      {category.questions?.length ? (
        <div className={styles.quiz}>
          {category.questions.map((question, qIndex) => (
            <div key={question.id} className={styles.questionBlock}>
              <div className={styles.questionText}>
                <strong>Spurning:</strong> {question.text}
              </div>
              <ul className={styles.answersList}>
                {question.answers.map((answer, aIndex) => (
                  <li key={answer.id} className={styles.answerItem}>
                    <label>
                      <input
                        type="radio"
                        name={`question-${qIndex}`}
                        onChange={() => handleAnswerChange(qIndex, aIndex)}
                      />
                      {answer.text}
                    </label>
                  </li>
                ))}
              </ul>
              <button className={styles.button} onClick={() => checkAnswer(qIndex)}>Skoða svar</button>
              <p className={styles.result}>{results[qIndex]}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.noQuestions}>Engar spurningar til staðar.</p>
      )}
    </div>
  );
}