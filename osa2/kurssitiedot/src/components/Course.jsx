import Total from './Total';
import Header from './Header';
import Content from './Content';


const Course = ({ courses }) => {
  console.log(courses);
  return (
    <>
      <Header text="Web Development curriculum" size="h1"/>
      {courses.map(course => 
        <div>
          <Header text={course.name} size="h2"/>
          <Content parts={course.parts}/>
          <Total courses={course.parts}/>
        </div>
      )} 
    </>
  )
};

export default Course;