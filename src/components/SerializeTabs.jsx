import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useActiveTab } from '../ActiveTabContext';
import { reduxHooks } from 'hooks';
import SerializeCourses from './SerializeCourses';
import './SerializeTabs.scss';

const MOBILE_BREAKPOINT = 768;

const SerializeTabs = ({ tabNames }) => {
  const { activeTab, setActiveTab } = useActiveTab();
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BREAKPOINT);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const groupedCourses = reduxHooks.useGroupedCoursesData();
  // Get the tab object by index instead of tab name
  const groupedCoursesArr = groupedCourses ? Object.values(groupedCourses) : [];
  const tabObj = groupedCoursesArr[activeTab];
  // Flatten the courses array if present
  const tabCourses = tabObj && Array.isArray(tabObj.courses)
    ? tabObj.courses.flat()
    : [];

  const serializeCoursesData = tabCourses.map(courseObj => ({
    bannerImgSrc: courseObj.course.bannerImgSrc,
    courseName: courseObj.course.courseName,
    homeUrl: courseObj.courseRun?.homeUrl || '',
    shortDescription: courseObj.course.shortDescription,
    courseNumber: courseObj.course.courseNumber,
    isStarted: courseObj.courseRun?.isStarted,
    resumeUrl: courseObj.courseRun?.resumeUrl,
    isStaff: courseObj.enrollment.coursewareAccess?.isStaff,
  }));

  return (
    <div className="grouped-tabs-container">
      {tabNames.length > 1 && (
        isMobile ? (
          <select
            className="form-select mb-2"
            value={activeTab}
            onChange={e => setActiveTab(Number(e.target.value))}
          >
            {tabNames.map((tab, idx) => (
              <option key={tab} value={idx}>{tab}</option>
            ))}
          </select>
        ) : (
          <div className="grouped-tabs mb-2 gap-1">
            {tabNames.map((tab, idx) => (
              <button
                key={tab}
                className={`grouped-tab-btn ${idx === activeTab ? 'tab-active' : 'tab-inactive'}`}
                onClick={() => setActiveTab(idx)}
              >
                {tab}
              </button>
            ))}
          </div>
        )
      )}

      {groupedCourses && (
        <SerializeCourses courses={serializeCoursesData} tabNames={tabNames} />
      )}
    </div>
  );
};

SerializeTabs.propTypes = {
  tabNames: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default SerializeTabs; 