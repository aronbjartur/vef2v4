"use client";

import { useState } from "react";
import { Category } from "@/types";
import { submitQuestion } from "@/components/Questions/submitQuestions";
import styles from "./ManageForm.module.css";

type ManageFormProps = {
  initialCategories: Category[];
};

export default function ManageForm({ initialCategories }: ManageFormProps) {
  const [categories] = useState<Category[]>(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [newCategory, setNewCategory] = useState("");
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const validateForm = () => {
    const isValid = Boolean(
      (
        ((selectedCategory && selectedCategory !== "new") ||
          (selectedCategory === "new" && newCategory.trim())) &&
        question.trim() &&
        answers.every((ans) => ans.trim()) &&
        correctAnswer !== null
      )
    );
    setIsFormValid(isValid);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
  
    setMessage("");
  
    const formData = new FormData();
    formData.append("question", question);
    answers.forEach((answer) => formData.append("answers[]", answer));
    formData.append("correct_answer", correctAnswer?.toString() || "");
    
    if (selectedCategory === "new") {
      formData.append("new_category", newCategory);
    } else {
      formData.append("category_id", selectedCategory);
    }
  
    try {
      await submitQuestion(formData);
      setMessage("spurning skráð!");
      setQuestion("");
      setAnswers(["", "", "", ""]);
      setCorrectAnswer(null);
      setSelectedCategory("");
      setNewCategory("");
    } catch (error) {
      setMessage("virkaði ekki að senda spurningu");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Veldu eða búðu til flokk</legend>
        <label className={styles.label} htmlFor="category_id">Veldu flokk:</label>
        <select
          id="category_id"
          name="category_id"
          required
          className={styles.input}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            validateForm();
          }}
          value={selectedCategory}
        >
          <option value=""> Veldu flokk </option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
          <option value="new">Nýr flokk</option>
        </select>

        {selectedCategory === "new" && (
          <div>
            <label className={styles.label} htmlFor="new_category">Nýr flokk (sláðu inn nafn):</label>
            <input
              type="text"
              id="new_category"
              name="new_category"
              className={styles.input}
              value={newCategory}
              onChange={(e) => {
                setNewCategory(e.target.value);
                validateForm();
              }}
            />
          </div>
        )}
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Spurning</legend>
        <label className={styles.label} htmlFor="question">Spurning:</label>
        <textarea
          id="question"
          name="question"
          required
          className={styles.input}
          value={question}
          onChange={(e) => {
            setQuestion(e.target.value);
            validateForm();
          }}
        />
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Svarmöguleikar</legend>
        {answers.map((ans, idx) => (
          <div key={idx}>
            <label className={styles.label} htmlFor={`answer${idx + 1}`}>Svar #{idx + 1}:</label>
            <input
              type="text"
              id={`answer${idx + 1}`}
              name="answers[]"
              className={styles.input}
              value={ans}
              onChange={(e) => {
                const newAns = [...answers];
                newAns[idx] = e.target.value;
                setAnswers(newAns);
                validateForm();
              }}
            />
          </div>
        ))}
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Rétt svar</legend>
        <label className={styles.label} htmlFor="correct_answer">Veldu númer rétta svarsins:</label>
        <select
          id="correct_answer"
          name="correct_answer"
          required
          className={styles.input}
          value={correctAnswer ?? ""}
          onChange={(e) => {
            setCorrectAnswer(parseInt(e.target.value, 10));
            validateForm();
          }}
        >
          <option value="">-- Veldu rétt svar --</option>
          <option value="1">Svar #1</option>
          <option value="2">Svar #2</option>
          <option value="3">Svar #3</option>
          <option value="4">Svar #4</option>
        </select>
      </fieldset>

      {isFormValid && <button className={styles.button}>Skrá spurningu</button>}

      {message && <p className={styles.message}>{message}</p>}
    </form>
  );
}