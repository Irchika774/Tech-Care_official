import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Schedule = () => {
  const navigate = useNavigate();
  const [deviceType, setDeviceType] = useState('smartphone');
  const [repairService, setRepairService] = useState('battery');
  const [technician, setTechnician] = useState('john');
  const [selectedDate, setSelectedDate] = useState(30);
  const [timeSlot, setTimeSlot] = useState('09:00');

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/payment');
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-text-light dark:text-text-dark min-h-screen flex items-center justify-center p-4">
      <div className="bg-card-light dark:bg-card-dark p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-light dark:text-text-dark">
            Schedule Your TechCare Service
          </h1>
          <p className="text-subtext-light dark:text-subtext-dark mt-2">
            Effortlessly book your device repair with certified technicians.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-subtext-light dark:text-subtext-dark">
                  Device Type
                </label>
                <div className="flex items-center space-x-6 mt-2">
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="radio" 
                      name="device_type" 
                      value="smartphone"
                      checked={deviceType === 'smartphone'}
                      onChange={(e) => setDeviceType(e.target.value)}
                      className="form-radio text-primary focus:ring-primary"
                    />
                    <span className="ml-2 text-text-light dark:text-text-dark">Smartphone</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="radio" 
                      name="device_type" 
                      value="laptop"
                      checked={deviceType === 'laptop'}
                      onChange={(e) => setDeviceType(e.target.value)}
                      className="form-radio text-primary focus:ring-primary"
                    />
                    <span className="ml-2 text-text-light dark:text-text-dark">Laptop</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="radio" 
                      name="device_type" 
                      value="pc"
                      checked={deviceType === 'pc'}
                      onChange={(e) => setDeviceType(e.target.value)}
                      className="form-radio text-primary focus:ring-primary"
                    />
                    <span className="ml-2 text-text-light dark:text-text-dark">PC</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-subtext-light dark:text-subtext-dark" htmlFor="repair_service">
                  Repair Service
                </label>
                <select 
                  id="repair_service" 
                  name="repair_service"
                  value={repairService}
                  onChange={(e) => setRepairService(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-border-light dark:border-border-dark focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-card-light dark:bg-card-dark text-text-light dark:text-text-dark"
                >
                  <option value="battery">Battery Replacement</option>
                  <option value="screen">Screen Repair</option>
                  <option value="water">Water Damage</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-subtext-light dark:text-subtext-dark" htmlFor="technician">
                  Select Technician or Shop
                </label>
                <select 
                  id="technician" 
                  name="technician"
                  value={technician}
                  onChange={(e) => setTechnician(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-border-light dark:border-border-dark focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-card-light dark:bg-card-dark text-text-light dark:text-text-dark"
                >
                  <option value="john">John Doe (Verified Tech)</option>
                  <option value="jane">Jane Smith (Authorized Shop)</option>
                </select>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-subtext-light dark:text-subtext-dark">
                  Select Date
                </label>
                <div className="bg-card-light dark:bg-card-dark p-4 rounded-lg border border-border-light dark:border-border-dark mt-2">
                  <div className="flex items-center justify-between mb-4">
                    <button type="button" className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                      <span className="material-icons text-subtext-light dark:text-subtext-dark">chevron_left</span>
                    </button>
                    <h3 className="font-semibold text-text-light dark:text-text-dark">September 2025</h3>
                    <button type="button" className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                      <span className="material-icons text-subtext-light dark:text-subtext-dark">chevron_right</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-2 text-center text-sm">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                      <div key={day} className="text-subtext-light dark:text-subtext-dark">{day}</div>
                    ))}
                    {[...Array(35)].map((_, i) => {
                      const day = i - 1;
                      if (day < 0 || day > 29) {
                        return <div key={i} className="text-gray-400 dark:text-gray-500">{day < 0 ? 31 : day - 29}</div>;
                      }
                      if (day === 29) {
                        return (
                          <div 
                            key={i}
                            onClick={() => setSelectedDate(30)}
                            className={`${selectedDate === 30 ? 'bg-primary text-white' : ''} rounded-full w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-primary hover:text-white`}
                          >
                            30
                          </div>
                        );
                      }
                      return <div key={i} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center">{day + 1}</div>;
                    })}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-subtext-light dark:text-subtext-dark">
                  Select Time Slot
                </label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'].map((time) => (
                    <label key={time} className="flex items-center cursor-pointer">
                      <input 
                        type="radio" 
                        name="time_slot" 
                        value={time}
                        checked={timeSlot === time}
                        onChange={(e) => setTimeSlot(e.target.value)}
                        disabled={time === '11:00 AM'}
                        className="form-radio text-primary focus:ring-primary"
                      />
                      <span className={`ml-2 ${time === '11:00 AM' ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed' : 'text-text-light dark:text-text-dark'}`}>
                        {time}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button 
              type="submit"
              className="bg-primary text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Confirm Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Schedule;
