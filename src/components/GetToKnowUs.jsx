import React from 'react';
import marcus from  '../assets/marcus.jpeg'
import jake from  '../assets/JAKE.jpeg'
import david from  '../assets/David.jpeg'
import roy from  '../assets/roy.jpeg'

const teamData = [
  {
    name: 'Marcus Chongwani',
    title: 'Founder & S.E',
    description: 'Innovative Thinker\nCode Enthusiast\nVisionary Leader',
    image: marcus
  },
  {
    name: 'Jackson Njovu',
    title: 'Founder & CTO',
    description: 'Tech Visionary\nProblem Solver\nGym Enthusiast',
    image: jake
  },
  {
    name: 'David Nkana',
    title: 'Software Engineer',
    description: 'Code Craftsman\nAI Aficionado\nHiking Adventurer',
    image: david
  },
  {
    name: 'Roy Kamwanza',
    title: 'Marketing Specialist',
    description: 'Brand Strategist\nContent Creator\nGrowth Driver',
    image: roy
  }
];




const ProfileCard = ({ name, title, description, image }) => {
  return (
    <div className="profile-card" key={name}>
        <div>
          <img src={image} alt={name} className="profile-image" />
        </div>
        <div>
        <h3>{name}</h3>
        <p className="profile-title">{title}</p>
        <p className="description">{description}</p>
        </div>
    </div>
  );
};
const GetToKnowUs = () => {
  return (
    <div className="get-to-know-us">
      {teamData.map(member => (
        <ProfileCard
          key={member.name}
          name={member.name}
          title={member.title}
          description={member.description}
          image={member.image}
        />
      ))}
    </div>
  );
};



export default GetToKnowUs;
