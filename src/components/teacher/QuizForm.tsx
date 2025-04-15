import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const QuizForm = () => {
  const { courseId } = useParams();
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    passingScore: '',
    questions: [{
      question: '',
      options: ['', '', '', ''],
      correctOption: 0
    }]
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setQuizData(prev => ({ ...prev, [name]: value }));
  };

  const handleQuestionChange = (index: number, field: string, value: string) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setQuizData(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[qIndex].options[oIndex] = value;
    setQuizData(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const addQuestion = () => {
    setQuizData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        { question: '', options: ['', '', '', ''], correctOption: 0 }
      ]
    }));
    // Move to the newly added question
    setCurrentQuestionIndex(quizData.questions.length);
  };

  const removeQuestion = (index: number) => {
    if (quizData.questions.length > 1) {
      const updatedQuestions = [...quizData.questions];
      updatedQuestions.splice(index, 1);
      setQuizData(prev => ({ ...prev, questions: updatedQuestions }));
      
      // Adjust current index if we're removing the current or a previous question
      if (currentQuestionIndex >= index) {
        setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/v1/quiz/quizzes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          courseId,
          title: quizData.title,
          description: quizData.description,
          passingScore: Number(quizData.passingScore),
          questions: quizData.questions.map(q => ({
            question: q.question,
            options: q.options,
            correctOption: Number(q.correctOption)
          }))
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('Quiz created successfully!');
        // Redirect or reset form
      } else {
        alert(data.message || 'Failed to create quiz');
      }
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert('Failed to create quiz');
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Create New Quiz
          </h2>
          <p className="mt-3 text-xl text-gray-300">
            Design your assessment for the course
          </p>
        </div>

        <div className="bg-gray-800 shadow-xl rounded-lg p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Quiz Metadata */}
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                  Quiz Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={quizData.title}
                  onChange={handleInputChange}
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={quizData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="passingScore" className="block text-sm font-medium text-gray-300">
                  Passing Score (minimum correct answers)
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="number"
                    id="passingScore"
                    name="passingScore"
                    value={quizData.passingScore}
                    onChange={handleInputChange}
                    min="1"
                    max={quizData.questions.length}
                    className="flex-1 min-w-0 block w-full bg-gray-700 border border-gray-600 rounded-l-md py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Questions Section */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-300">
                  Question {currentQuestionIndex + 1} of {quizData.questions.length}
                </h3>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add Question
                </button>
              </div>

              {/* Current Question Display */}
              <div className="bg-gray-700 p-4 rounded-lg shadow">
                <div className="flex justify-between items-start">
                  <h4 className="text-md font-medium text-gray-200 mb-3">
                    Question {currentQuestionIndex + 1}
                  </h4>
                  {quizData.questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(currentQuestionIndex)}
                      className="text-red-400 hover:text-red-300 text-sm font-medium"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor={`question-${currentQuestionIndex}`} className="block text-sm font-medium text-gray-300 mb-1">
                    Question Text
                  </label>
                  <input
                    type="text"
                    id={`question-${currentQuestionIndex}`}
                    value={quizData.questions[currentQuestionIndex].question}
                    onChange={(e) => handleQuestionChange(currentQuestionIndex, 'question', e.target.value)}
                    className="block w-full bg-gray-600 border border-gray-500 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Options (select the correct one)
                  </label>
                  <div className="space-y-2">
                    {quizData.questions[currentQuestionIndex].options.map((option, oIndex) => (
                      <div key={oIndex} className="flex items-center">
                        <input
                          type="radio"
                          name={`correctOption-${currentQuestionIndex}`}
                          checked={quizData.questions[currentQuestionIndex].correctOption === oIndex}
                          onChange={() => handleQuestionChange(currentQuestionIndex, 'correctOption', oIndex.toString())}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-500"
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handleOptionChange(currentQuestionIndex, oIndex, e.target.value)}
                          className="ml-3 block flex-1 bg-gray-600 border border-gray-500 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                          placeholder={`Option ${oIndex + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Question Navigation */}
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={goToPrevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium ${currentQuestionIndex === 0 ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={goToNextQuestion}
                  disabled={currentQuestionIndex === quizData.questions.length - 1}
                  className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium ${currentQuestionIndex === quizData.questions.length - 1 ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
                >
                  Next
                </button>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-200 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex justify-center px-6 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Quiz
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuizForm;