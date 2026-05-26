import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { updateUserProfile } from '../utils/api';

interface Props { role: 'coach' | 'student'; onClose: () => void; }

const SPORTS = ['Soccer','Basketball','Volleyball','Ultimate Frisbee','Lacrosse','Rugby','Tennis','Swimming','Track and Field','Baseball','Softball','Ice Hockey','Field Hockey','Martial Arts','Climbing'];
const LEVELS = [{ value: 'beginner', label: 'Beginner' }, { value: 'intermediate', label: 'Intermediate' }, { value: 'advanced', label: 'Advanced' }];
const COMPETITION_LEVELS = ['recreational','competitive','elite'];

export default function ProfileModal({ role, onClose }: Props) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    fetch('http://localhost:8000/users/' + user.uid)
      .then(r => r.json())
      .then(data => { setForm(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const set = (key: string, val: any) => setForm((p: any) => ({ ...p, [key]: val }));
  const toggleArr = (key: string, val: string) => setForm((p: any) => ({
    ...p, [key]: (p[key] || []).includes(val) ? p[key].filter((x: string) => x !== val) : [...(p[key] || []), val]
  }));

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;
    setSaving(true);
    try {
      const payload: any = { name: form.name, phone: form.phone, gender: form.gender };
      if (role === 'coach') {
        payload.coaching_style = form.coaching_style;
        payload.rate = form.rate;
        payload.certification = form.certification;
        payload.competition_level = form.competition_level;
        payload.sport_details = form.sport_details;
      } else {
        payload.goals = form.goals;
        payload.budget = form.budget;
        payload.level = form.level;
        payload.graduation_year = form.graduation_year;
        payload.interests = form.interests;
        payload.preferred_times = form.preferred_times;
      }
      await updateUserProfile(user.uid, payload);
      setSaved(true);
      setTimeout(() => { setSaved(false); onClose(); }, 1200);
    } catch(e) { console.error(e); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',zIndex:100,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{background:'white',borderRadius:'20px',padding:'40px',fontSize:'16px',fontWeight:'600'}}>Loading profile...</div>
    </div>
  );

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',zIndex:100,display:'flex',alignItems:'center',justifyContent:'center',padding:'16px'}}>
      <div style={{background:'white',borderRadius:'20px',padding:'28px',maxWidth:'520px',width:'100%',maxHeight:'85vh',overflowY:'auto',boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
          <h3 style={{fontWeight:'800',fontSize:'20px',margin:0}}>Edit Profile</h3>
          <button onClick={onClose} style={{background:'none',border:'none',fontSize:'20px',cursor:'pointer',color:'#888'}}></button>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'16px'}}>
          <div><label style={{fontSize:'12px',fontWeight:'600',color:'#666',display:'block',marginBottom:'4px'}}>Full Name</label>
            <input value={form.name||''} onChange={e=>set('name',e.target.value)} style={{width:'100%',padding:'8px 10px',borderRadius:'8px',border:'1px solid #ddd',fontSize:'13px',boxSizing:'border-box'}} /></div>
          <div><label style={{fontSize:'12px',fontWeight:'600',color:'#666',display:'block',marginBottom:'4px'}}>Phone</label>
            <input value={form.phone||''} onChange={e=>set('phone',e.target.value)} style={{width:'100%',padding:'8px 10px',borderRadius:'8px',border:'1px solid #ddd',fontSize:'13px',boxSizing:'border-box'}} /></div>
        </div>

        <div style={{marginBottom:'16px'}}>
          <label style={{fontSize:'12px',fontWeight:'600',color:'#666',display:'block',marginBottom:'6px'}}>Gender</label>
          <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
            {['Male','Female','Non-binary','Prefer not to say'].map(g => (
              <button key={g} onClick={()=>set('gender',g)} style={{padding:'6px 14px',borderRadius:'20px',border:'1px solid',borderColor:form.gender===g?'#E21833':'#ddd',background:form.gender===g?'#FFF3F4':'white',color:form.gender===g?'#E21833':'#666',fontSize:'12px',fontWeight:'600',cursor:'pointer'}}>{g}</button>
            ))}
          </div>
        </div>

        {role === 'coach' && <>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'16px'}}>
            <div><label style={{fontSize:'12px',fontWeight:'600',color:'#666',display:'block',marginBottom:'4px'}}>Rate ($/hr)</label>
              <input type='number' value={form.rate||''} onChange={e=>set('rate',e.target.value)} style={{width:'100%',padding:'8px 10px',borderRadius:'8px',border:'1px solid #ddd',fontSize:'13px',boxSizing:'border-box'}} /></div>
            <div><label style={{fontSize:'12px',fontWeight:'600',color:'#666',display:'block',marginBottom:'4px'}}>Certification</label>
              <input value={form.certification||''} onChange={e=>set('certification',e.target.value)} style={{width:'100%',padding:'8px 10px',borderRadius:'8px',border:'1px solid #ddd',fontSize:'13px',boxSizing:'border-box'}} /></div>
          </div>
          <div style={{marginBottom:'16px'}}>
            <label style={{fontSize:'12px',fontWeight:'600',color:'#666',display:'block',marginBottom:'4px'}}>Coaching Style</label>
            <textarea value={form.coaching_style||''} onChange={e=>set('coaching_style',e.target.value)} rows={3} style={{width:'100%',padding:'8px 10px',borderRadius:'8px',border:'1px solid #ddd',fontSize:'13px',resize:'none',boxSizing:'border-box'}} />
          </div>
          <div style={{marginBottom:'16px'}}>
            <label style={{fontSize:'12px',fontWeight:'600',color:'#666',display:'block',marginBottom:'6px'}}>Competition Level</label>
            <div style={{display:'flex',gap:'8px'}}>
              {COMPETITION_LEVELS.map(l => (
                <button key={l} onClick={()=>toggleArr('competition_level',l)} style={{padding:'6px 14px',borderRadius:'20px',border:'1px solid',borderColor:(form.competition_level||[]).includes(l)?'#E21833':'#ddd',background:(form.competition_level||[]).includes(l)?'#FFF3F4':'white',color:(form.competition_level||[]).includes(l)?'#E21833':'#666',fontSize:'12px',fontWeight:'600',cursor:'pointer',textTransform:'capitalize'}}>{l}</button>
              ))}
            </div>
          </div>
          {form.sport_details && Object.keys(form.sport_details).length > 0 && (
            <div style={{marginBottom:'16px'}}>
              <label style={{fontSize:'12px',fontWeight:'600',color:'#666',display:'block',marginBottom:'8px'}}>Experience by Sport</label>
              {Object.entries(form.sport_details).map(([sport, d]: [string, any]) => (
                <div key={sport} style={{marginBottom:'12px',padding:'12px',borderRadius:'10px',border:'1px solid #eee',background:'#fafafa'}}>
                  <p style={{fontWeight:'700',color:'#E21833',fontSize:'13px',marginBottom:'8px'}}>{sport}</p>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px',marginBottom:'8px'}}>
                    <div><label style={{fontSize:'11px',color:'#888',display:'block',marginBottom:'3px'}}>Coaching Years</label>
                      <input type='number' min='0' value={d.coachingYears||''} onChange={e=>set('sport_details',{...form.sport_details,[sport]:{...d,coachingYears:e.target.value}})} style={{width:'100%',padding:'6px 8px',borderRadius:'6px',border:'1px solid #ddd',fontSize:'12px',boxSizing:'border-box'}} /></div>
                    <div><label style={{fontSize:'11px',color:'#888',display:'block',marginBottom:'3px'}}>Playing Years</label>
                      <input type='number' min='0' value={d.playingYears||''} onChange={e=>set('sport_details',{...form.sport_details,[sport]:{...d,playingYears:e.target.value}})} style={{width:'100%',padding:'6px 8px',borderRadius:'6px',border:'1px solid #ddd',fontSize:'12px',boxSizing:'border-box'}} /></div>
                  </div>
                  <div><label style={{fontSize:'11px',color:'#888',display:'block',marginBottom:'3px'}}>Achievements</label>
                    <textarea value={d.achievements||''} onChange={e=>set('sport_details',{...form.sport_details,[sport]:{...d,achievements:e.target.value}})} rows={2} style={{width:'100%',padding:'6px 8px',borderRadius:'6px',border:'1px solid #ddd',fontSize:'12px',resize:'none',boxSizing:'border-box'}} /></div>
                </div>
              ))}
            </div>
          )}
        </>}

        {role === 'student' && <>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'16px'}}>
            <div><label style={{fontSize:'12px',fontWeight:'600',color:'#666',display:'block',marginBottom:'4px'}}>Graduation Year</label>
              <select value={form.graduation_year||''} onChange={e=>set('graduation_year',e.target.value)} style={{width:'100%',padding:'8px 10px',borderRadius:'8px',border:'1px solid #ddd',fontSize:'13px'}}>
                {['2025','2026','2027','2028','2029','2030'].map(y=><option key={y} value={y}>{y}</option>)}
              </select></div>
            <div><label style={{fontSize:'12px',fontWeight:'600',color:'#666',display:'block',marginBottom:'4px'}}>Budget ($/hr)</label>
              <input type='number' min='0' value={form.budget||''} onChange={e=>set('budget',e.target.value)} style={{width:'100%',padding:'8px 10px',borderRadius:'8px',border:'1px solid #ddd',fontSize:'13px',boxSizing:'border-box'}} /></div>
          </div>
          <div style={{marginBottom:'16px'}}>
            <label style={{fontSize:'12px',fontWeight:'600',color:'#666',display:'block',marginBottom:'6px'}}>Skill Level</label>
            <div style={{display:'flex',gap:'8px'}}>
              {LEVELS.map(l => (
                <button key={l.value} onClick={()=>set('level',l.value)} style={{padding:'6px 14px',borderRadius:'20px',border:'1px solid',borderColor:form.level===l.value?'#E21833':'#ddd',background:form.level===l.value?'#FFF3F4':'white',color:form.level===l.value?'#E21833':'#666',fontSize:'12px',fontWeight:'600',cursor:'pointer'}}>{l.label}</button>
              ))}
            </div>
          </div>
          <div style={{marginBottom:'16px'}}>
            <label style={{fontSize:'12px',fontWeight:'600',color:'#666',display:'block',marginBottom:'4px'}}>Goals</label>
            <textarea value={form.goals||''} onChange={e=>set('goals',e.target.value)} rows={3} style={{width:'100%',padding:'8px 10px',borderRadius:'8px',border:'1px solid #ddd',fontSize:'13px',resize:'none',boxSizing:'border-box'}} />
          </div>
          <div style={{marginBottom:'16px'}}>
            <label style={{fontSize:'12px',fontWeight:'600',color:'#666',display:'block',marginBottom:'6px'}}>Sports Interests</label>
            <div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>
              {SPORTS.map(s => (
                <button key={s} onClick={()=>toggleArr('interests',s)} style={{padding:'5px 12px',borderRadius:'20px',border:'1px solid',borderColor:(form.interests||[]).includes(s)?'#E21833':'#ddd',background:(form.interests||[]).includes(s)?'#FFF3F4':'white',color:(form.interests||[]).includes(s)?'#E21833':'#666',fontSize:'12px',fontWeight:'600',cursor:'pointer'}}>{s}</button>
              ))}
            </div>
          </div>
        </>}

        <div style={{display:'flex',gap:'10px',justifyContent:'flex-end',marginTop:'8px'}}>
          <button onClick={onClose} style={{padding:'10px 20px',borderRadius:'10px',border:'1px solid #ddd',cursor:'pointer',background:'white',fontWeight:'600'}}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{padding:'10px 20px',borderRadius:'10px',border:'none',cursor:'pointer',background:saved?'#2E7D32':'#E21833',color:'white',fontWeight:'700',minWidth:'80px'}}>
            {saved ? 'Saved!' : saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
