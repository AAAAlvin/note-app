'use client'

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface DashboardCard {
  title: string;
  description?: string;
}

const dashboardCards: DashboardCard[] = [
  { title: 'KPI Dashboard', description: '매출, 트래픽 등 주요 지표' },
  { title: '매출 추이', description: '월별 매출 그래프' },
  { title: '방문자 분석', description: '일별 방문자 수' },
  { title: '고객 만족도', description: '설문 결과 요약' },
  { title: '신규 가입자', description: '월별 신규 가입자 수' },
  { title: '이탈률', description: '월별 이탈률 변화' },
  { title: '매출 TOP 5', description: '상위 매출 상품' },
  { title: '트래픽 소스', description: '유입 경로 분석' },
  { title: '알림', description: '최근 알림 및 공지' },
];

// 샘플 차트 데이터
const sampleData = {
  labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
  datasets: [
    {
      label: '매출',
      data: [120, 190, 300, 500, 200, 300],
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
  ],
};

const sampleOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    title: { display: false },
  },
  scales: {
    x: { grid: { display: false } },
    y: { grid: { display: false }, beginAtZero: true },
  },
};

export default function CardDashboard() {
  return (
    <div className="flex flex-col h-screen py-10">
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {dashboardCards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer flex flex-col"
            >
              <div className="mb-4 h-40">
                <Bar data={sampleData} options={sampleOptions} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
              <p className="text-gray-500">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 