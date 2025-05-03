"use client";
import React, { useState, useEffect, useCallback } from 'react';

const GRID_SIZE = 20;
const GRID_WIDTH = 20;
const GRID_HEIGHT = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 15, y: 10 };
const INITIAL_DIRECTION = { x: 1, y: 0 };

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_WIDTH),
      y: Math.floor(Math.random() * GRID_HEIGHT),
    };
    return newFood;
  }, []);

  const checkCollision = useCallback((head: { x: number; y: number }, snakeBody: { x: number; y: number }[]) => {
    if (head.x < 0 || head.x >= GRID_WIDTH || head.y < 0 || head.y >= GRID_HEIGHT) {
      return true;
    }
    for (let i = 0; i < snakeBody.length - 1; i++) {
      if (head.x === snakeBody[i].x && head.y === snakeBody[i].y) {
        return true;
      }
    }
    return false;
  }, []);

  const moveSnake = useCallback(() => {
    if (!isPlaying || gameOver) return;

    const newSnake = [...snake];
    const head = { x: newSnake[0].x + direction.x, y: newSnake[0].y + direction.y };

    if (checkCollision(head, newSnake)) {
      setGameOver(true);
      setIsPlaying(false);
      return;
    }

    newSnake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      setScore(score + 1);
      setFood(generateFood());
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, direction, food, score, gameOver, isPlaying, checkCollision, generateFood]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          if (!isPlaying && !gameOver) setIsPlaying(true);
          else if (gameOver) {
            setSnake(INITIAL_SNAKE);
            setFood(INITIAL_FOOD);
            setDirection(INITIAL_DIRECTION);
            setGameOver(false);
            setScore(0);
            setIsPlaying(true);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameOver, isPlaying]);

  useEffect(() => {
    if (isPlaying && !gameOver) {
      const gameLoop = setInterval(moveSnake, 100);
      return () => clearInterval(gameLoop);
    }
  }, [isPlaying, gameOver, moveSnake]);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">贪吃蛇游戏</h1>
      <div className="mb-4">
        <p>分数: {score}</p>
        <p>{gameOver ? '游戏结束！按空格键重新开始' : isPlaying ? '游戏中...' : '按空格键开始'}</p>
      </div>
      <div
        className="grid border-2 border-gray-300"
        style={{
          gridTemplateColumns: `repeat(${GRID_WIDTH}, ${GRID_SIZE}px)`,
          gridTemplateRows: `repeat(${GRID_HEIGHT}, ${GRID_SIZE}px)`,
        }}
      >
        {Array.from({ length: GRID_HEIGHT }).map((_, row) =>
          Array.from({ length: GRID_WIDTH }).map((_, col) => {
            const isSnake = snake.some(segment => segment.x === col && segment.y === row);
            const isFood = food.x === col && food.y === row;
            return (
              <div
                key={`${row}-${col}`}
                className={`w-${GRID_SIZE} h-${GRID_SIZE} ${
                  isSnake ? 'bg-green-500' : isFood ? 'bg-red-500' : 'bg-gray-100'
                }`}
                style={{ width: `${GRID_SIZE}px`, height: `${GRID_SIZE}px` }}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default SnakeGame;