const chapters=[...document.querySelectorAll('.chapter')];
const links=[...document.querySelectorAll('.chapters a')];
const progress=document.querySelector('.progress');
const active=new IntersectionObserver(entries=>{
  for(const entry of entries){
    if(!entry.isIntersecting)continue;
    const index=chapters.indexOf(entry.target);
    links.forEach((link,i)=>{
      if(i===index){link.setAttribute('aria-current','location');link.scrollIntoView({block:'nearest',inline:'nearest'});}
      else link.removeAttribute('aria-current');
    });
  }
},{rootMargin:'-35% 0px -55% 0px'});
chapters.forEach(chapter=>active.observe(chapter));
let pending=false;
addEventListener('scroll',()=>{
  if(pending)return;
  pending=true;
  requestAnimationFrame(()=>{
    const max=document.documentElement.scrollHeight-innerHeight;
    progress.style.transform=`scaleX(${max>0?scrollY/max:0})`;
    pending=false;
  });
},{passive:true});

const visualizer=document.querySelector('#visualizer-model');
if(visualizer){
  const tabs=[...visualizer.querySelectorAll('[role="tab"]')];
  const panel=visualizer.querySelector('[role="tabpanel"]');
  const views={
    teras:{root:'Masjid Sejahtera',nodes:[['Mekah · Iman','Ilmu, ibadah, akhlak dan pembelajaran berterusan.'],['Madinah · Muafakat','Hubungan keluarga, kebajikan, khidmat komuniti dan kerjasama.'],['Baitul Maqdis · Sejahtera','Keupayaan, ekonomi, warisan dan jaringan.']]},
    sahabat:{root:'Sahabat Masjid',nodes:[['Keilmuan','Bimbingan dan perkongsian ilmu.'],['Profesional','Kepakaran dan khidmat nasihat.'],['Usahawan','Mentor dan jaringan perniagaan.'],['Anak Muda','Pelaksanaan dan inovasi program.'],['Cilik','Penyertaan sesuai umur.'],['Kasih','Kebajikan dan sokongan keluarga.'],['Infak','Sokongan sumber yang sesuai.'],['Agensi','Kerjasama institusi dan rujukan.'],['Wanita','Kepimpinan dan jaringan sokongan.'],['Kepimpinan','Penyelarasan dan pembangunan pasukan.']]},
    modul:{root:'BMC Amanah',nodes:[['Program','Peserta, kehadiran, bajet dan hasil yang disemak.'],['Kariah dan bantuan','Penilaian, keputusan, dana dan bukti agihan.'],['Madrasah','Kelas, guru, pelajar, kehadiran dan nota.'],['Sahabat Masjid','Keahlian, roster dan tugasan program.'],['Dana dan perakaunan','Lejar berasingan, jurnal, bajet dan kelulusan.'],['Kakitangan, aset dan kemudahan','Penggajian, daftar aset, penyelenggaraan dan tempahan.'],['Pemantauan dan pelaporan','Agregat dalam liputan tugas dan laporan.']]},
    dana:{root:'Pengurusan dana berasaskan amanah',nodes:[['Zakat','Tujuan dan sekatan dana.'],['Infaq','Tujuan dan sekatan dana.'],['Waqf','Projek, aset, korpus, pendapatan dan manfaat.'],['Qardul Hasan','Skim, kes, pengeluaran dan bayaran balik.'],['Tabung Mahabbah','Mekanisme sokongan dengan tujuan dan delegasi tersendiri.']],flow:['Catatan transaksi','Menunggu kelulusan','Diluluskan','Baki lejar dan jurnal dikemas kini'],note:'Catatan menunggu tidak mengubah baki dipos.'}
  };
  const render=(key)=>{
    const view=views[key];
    const nodes=view.nodes.map(([title,description],i)=>`<article class="viz-node"><span class="viz-index">${String(i+1).padStart(2,'0')}</span><h3>${title}</h3><p>${description}</p></article>`).join('');
    const flow=view.flow?`<div class="viz-flow" aria-label="${view.flow.join(' → ')}">${view.flow.map((label,i)=>`<div class="viz-flow-step"><span class="viz-index">0${i+1}</span><strong>${label}</strong></div>`).join('<span class="viz-flow-link" aria-hidden="true">→</span>')}</div><p class="viz-note">${view.note}</p>`:'';
    panel.innerHTML=`<div class="viz-root"><span class="viz-root-mark" aria-hidden="true">${key==='teras'?'م':key==='sahabat'?'۞':key==='modul'?'⌘':'◉'}</span><strong>${view.root}</strong></div><div class="viz-branches ${key==='sahabat'?'viz-branches--ten':''} ${key==='modul'?'viz-branches--modules':''}">${nodes}</div>${flow}`;
  };
  const select=(tab)=>{
    tabs.forEach(item=>{const active=item===tab;item.setAttribute('aria-selected',String(active));item.tabIndex=active?0:-1;});
    render(tab.dataset.view);
  };
  tabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>select(tab));
    tab.addEventListener('keydown',event=>{
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
      event.preventDefault();
      const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
      tabs[next].focus();select(tabs[next]);
    });
  });
  render('teras');
}