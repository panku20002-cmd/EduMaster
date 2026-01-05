import React from 'react';
import { PlayCircle, Clock, BarChart } from 'lucide-react';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow group">
      <div className="relative h-40 overflow-hidden">
        <img 
            src={course.thumbnail} 
            alt={course.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-slate-700">
            {course.category}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-slate-800 line-clamp-2 text-sm md:text-base leading-tight">
                {course.title}
            </h3>
        </div>
        
        <p className="text-xs text-slate-500 mb-4 flex items-center gap-1">
            <span className="w-5 h-5 rounded-full bg-slate-200 inline-block overflow-hidden">
                {/* Placeholder avatar */}
                 <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${course.instructor}`} alt="" />
            </span>
            {course.instructor}
        </p>

        {/* Progress Section */}
        <div className="mb-4">
            <div className="flex justify-between text-xs mb-1 text-slate-500">
                <span>{course.progress}% Completed</span>
                <span>{course.completedLessons}/{course.totalLessons} Lessons</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div 
                    className={`h-full rounded-full ${course.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`} 
                    style={{ width: `${course.progress}%` }}
                ></div>
            </div>
        </div>

        {/* Action */}
        <button className="w-full py-2 rounded-lg bg-slate-50 text-blue-600 text-sm font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
            {course.progress > 0 ? (
                <>
                    <PlayCircle size={16} /> Continue Learning
                </>
            ) : (
                "Start Course"
            )}
        </button>
      </div>
    </div>
  );
};