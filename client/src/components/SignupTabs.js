import React, { useState } from 'react';
import AssoSignup from '../association/AssoSignup';
import VolSignup from '../volunteer/VolSignup';
import '../css/Tabs.css';

function SignupTabs(props) {

  const [activeTab, setActiveTab] = useState('vol');

  const OpenVolTab = (volTabs) => {
    setActiveTab(volTabs);
  };

  const OpenAssoTab = (assoTabs) => {
    setActiveTab(assoTabs);
  };

  return (
    <div className='tab-container'>
        <div className="tab">
            <button
              className={`tablinks${activeTab === 'vol' ? ' active' : ''}`}
              onClick={() => OpenVolTab('vol')}> מתנדב
            </button>
            <button
              className={`tablinks${activeTab === 'asso' ? ' active' : ''}`}
              onClick={() => OpenAssoTab('asso')}> עמותה
            </button>

        </div>

        {activeTab === 'vol' && (
            <div className="tabcontent">
                <VolSignup onRegister={props.onClose}/>
            </div> 
        )} 

        {activeTab === 'asso' && (
            <div className="tabcontent">
                <AssoSignup onRegister={props.onClose}/>
            </div>              
        )}       
    </div>
  );
}

export default SignupTabs;
