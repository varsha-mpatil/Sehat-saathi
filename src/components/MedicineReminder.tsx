import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pill, Clock, Plus, Check, Bell, X, Trash2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface Reminder {
  id: string;
  medicine: string;
  time: string;
  completed: boolean;
}

const MedicineReminder: React.FC = () => {
  const { t } = useLanguage();
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: '1', medicine: 'Paracetamol 500mg', time: '08:00 AM', completed: false },
    { id: '2', medicine: 'Vitamin D3', time: '09:30 AM', completed: true },
  ]);
  const [newMedicine, setNewMedicine] = useState('');
  const [newTime, setNewTime] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const addReminder = () => {
    if (!newMedicine || !newTime) return;
    const item: Reminder = {
      id: Date.now().toString(),
      medicine: newMedicine,
      time: newTime,
      completed: false,
    };
    setReminders([...reminders, item]);
    setNewMedicine('');
    setNewTime('');
    setIsAdding(false);
  };

  const toggleComplete = (id: string) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  return (
    <div id="reminders" className="py-24 bg-[#f8faf8]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 text-orange-600 text-[10px] font-bold uppercase tracking-[0.2em]">
              <Bell className="w-3 h-3" />
              {t.serviceReminders}
            </div>
            <h2 className="text-5xl font-extrabold text-[#00274c] leading-tight">
              Never Miss Your<br />
              <span className="text-[#167e00]">Recovery</span> Schedule
            </h2>
            <p className="text-xl text-gray-500 font-medium max-w-lg">
              {t.serviceRemindersDesc}
            </p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-3 px-8 py-4 bg-[#167e00] text-white font-bold rounded-2xl shadow-xl hover:bg-[#00274c] transition-all"
            >
              <Plus className="w-6 h-6" />
              {t.addNewMedicine}
            </motion.button>
          </div>

          <div className="flex-1 space-y-4">
            <AnimatePresence mode="popLayout">
              {reminders.map((reminder) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  key={reminder.id}
                  className={`p-6 rounded-[32px] border ${reminder.completed ? 'bg-green-50 border-green-100' : 'bg-white border-gray-100'} shadow-lg flex items-center justify-between transition-all group`}
                >
                  <div className="flex items-center gap-6">
                    <div className={`p-4 rounded-2xl ${reminder.completed ? 'bg-green-200' : 'bg-orange-50'} transition-colors`}>
                      <Pill className={`w-8 h-8 ${reminder.completed ? 'text-green-700' : 'text-orange-600'}`} />
                    </div>
                    <div className="space-y-1">
                      <h4 className={`text-xl font-bold ${reminder.completed ? 'text-green-800 line-through' : 'text-[#00274c]'}`}>
                        {reminder.medicine}
                      </h4>
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
                        <Clock className="w-4 h-4" />
                        {reminder.time}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleComplete(reminder.id)}
                      className={`p-4 rounded-xl shadow-md transition-all ${reminder.completed ? 'bg-green-600 text-white' : 'bg-white text-gray-400 hover:text-green-600'}`}
                    >
                      <Check className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => deleteReminder(reminder.id)}
                      className="p-4 bg-white text-gray-400 hover:text-red-500 rounded-xl shadow-md transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {reminders.length === 0 && (
              <div className="p-12 text-center bg-white rounded-[40px] border-2 border-dashed border-gray-200">
                <p className="text-gray-400 font-bold">{t.noActiveReminders}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-[#00274c]/60 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl relative"
            >
              <button 
                onClick={() => setIsAdding(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <h3 className="text-3xl font-bold mb-8">{t.addNewMedicine}</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-2">{t.medicineName}</label>
                  <input
                    type="text"
                    value={newMedicine}
                    onChange={(e) => setNewMedicine(e.target.value)}
                    placeholder="e.g. Paracetamol, Insulin..."
                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#167e00] outline-none transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-2">{t.dailyTime}</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#167e00] outline-none transition-all font-bold"
                  />
                </div>
                <button
                  onClick={addReminder}
                  className="w-full py-5 bg-[#167e00] text-white font-bold rounded-2xl shadow-xl hover:bg-[#00274c] transition-all"
                >
                  {t.createSchedule}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MedicineReminder;
