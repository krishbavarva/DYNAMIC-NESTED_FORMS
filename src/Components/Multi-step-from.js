import React, { createContext, useContext, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Link } from 'react-router-dom';
const TabContext = createContext();

const useTabs = (initialTab) => {
  const [currentTab, setCurrentTab] = useState(initialTab);
  return { currentTab, setCurrentTab };
};

const Tab = ({ value, children }) => {
  const { currentTab } = useContext(TabContext);
  if (value !== currentTab) return null;
  return <div>{children}</div>;
};

const MultiTabForm = () => {
    const[over , setOver] = useState('')
  const methods = useForm(); 
  const tabState = useTabs('personal'); 
  const handleNext = () => {
    if (tabState.currentTab === 'personal') {
      tabState.setCurrentTab('address');
    } else if (tabState.currentTab === 'address') {
      tabState.setCurrentTab('review');
    
    } 
  };

  const onSubmit = (data) => {
    console.log(data);
    setOver(data);
    if (tabState.currentTab === 'review') {
        tabState.setCurrentTab('overview');
      }
      
  };

  return (
    <FormProvider {...methods}>
      <TabContext.Provider value={tabState}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div>
            <button type="button" onClick={() => tabState.setCurrentTab('personal')}>Personal</button>
            <button type="button" onClick={() => tabState.setCurrentTab('address')}>Address</button>
            <button type="button" onClick={() => tabState.setCurrentTab('review')}>Review</button>
          </div>
          <Tab value="personal">
            <input {...methods.register('firstName')} placeholder="First Name" />
            <input {...methods.register('lastName')} placeholder="Last Name" />
            <button type="button" onClick={handleNext}>Next</button>
          </Tab>
          <Tab value="address">
            <input {...methods.register('street')} placeholder="Street" />
            <input {...methods.register('city')} placeholder="City" />
            <button type="button" onClick={handleNext}>Next</button>
          </Tab>
          <Tab value="review">
            <div>Review your information here</div>
            <button type="submit">Submit</button>
          </Tab>
          <Tab value="overview">
            <h1>{over.firstName + over.lastName}</h1>
                <h1>go to dynamic form</h1>
                <Link to="/dynamic" >Go to dynamic</Link>
          </Tab>
        </form>
      </TabContext.Provider>
    </FormProvider>
  );
};

export default MultiTabForm;
