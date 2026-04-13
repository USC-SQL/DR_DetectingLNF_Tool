import React, {useEffect, useMemo, useState} from 'react'
import { useNavigate , useLocation} from 'react-router-dom';


function LNF_Result(){
    const navigate = useNavigate();
    const location = useLocation(); //useLocation to read the state
    const { image, result } = location.state || {};
    const [selectedLNF, setSelectedLNF] = useState(null); //popup state
    const [viewMode, setViewMode] = useState('lnf'); //show lnfs or all transitions

    //get all transitions
    const allTransitions = useMemo(() => {
        return Array.isArray(result?.lnf_analysis) ? result.lnf_analysis : [];
    }, [result]);

    //filter displaying items
    const displayItems = useMemo(() => {
        if (viewMode === 'all') return allTransitions;
        return allTransitions.filter((item) => item?.is_lnf);
    }, [allTransitions, viewMode]);


    //closing the popup with esp key
    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key === 'Escape') setSelectedLNF(null);
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

    //turning JS object to downloaable file 
    const handleDownload = () => {
        if(!result) return;
        const jsonString = JSON.stringify(result,null,2); //pretty format
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = "chatgpt.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    const redirect = ()=>{
        navigate('/home')
    }

    return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4 text-slate-900">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={redirect}
            className="rounded-xl bg-slate-900 px-4 py-2 text-white shadow-sm transition hover:bg-slate-700"
          >
            Home
          </button>
          <button
            onClick={handleDownload}
            disabled={!result}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Download JSON
          </button>
        </div>

        <div className="flex justify-center">
          {image ? (
            <img
              src={image}
              alt="Uploaded"
              className="max-h-[70vh] w-auto max-w-[70vw] rounded-xl object-contain"
            />
          ) : (
            <div className="flex h-64 w-full max-w-2xl items-center justify-center text-slate-500">
              No image found
            </div>
          )}
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
                <h2 className="text-xl font-semibold">
                    {viewMode === 'lnf' ? 'Detected LNFs' : 'All Transitions'}
                </h2>
                <p className="text-sm text-slate-500">
                    {viewMode === 'lnf'
                        ? 'Showing only transitions marked as failures.'
                        : 'Showing every keyboard transition.'}
                </p>
            </div>

            <div className="flex rounded-2xl bg-slate-100 p-1">
              <button
                onClick={() => setViewMode('lnf')}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                  viewMode === 'lnf'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                LNFs only
              </button>
              <button
                onClick={() => setViewMode('all')}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                  viewMode === 'all'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                All transitions
              </button>
            </div>
          </div>

          <div className="mb-4 rounded-full bg-rose-100 px-3 py-1 text-sm font-semibold text-rose-700 inline-flex">
            {displayItems.length} {viewMode === 'lnf' ? 'detected' : 'transitions shown'}
          </div>

          {displayItems.length > 0 ? (
            <div className="space-y-3">
              {displayItems.map((item, index) => (
                <button
                  key={`${item.transition}-${index}`}
                  onClick={() => setSelectedLNF(item)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-50 hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-base font-bold text-white">
                      {index + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="text-base font-semibold text-slate-900">
                          {item.transition}
                        </div>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            item.is_lnf
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {item.is_lnf ? 'LNF' : 'OK'}
                        </span>
                      </div>

                      <div className="mt-2 text-sm text-slate-600">
                        {item.one_sentence_reason || 'No one-sentence summary provided.'}
                      </div>
                    </div>

                    <div className="shrink-0 text-sm font-medium text-indigo-700">
                      Open
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
              No transitions to show.
            </div>
          )}
        </div>
      </div>

      {selectedLNF && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedLNF(null)}
        >
          <div
            className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-indigo-600">
                  {selectedLNF.transition}
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Long Summary</h3>
              </div>

              <button
                onClick={() => setSelectedLNF(null)}
                className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
              >
                Exit
              </button>
            </div>

            <div className="space-y-4 text-sm leading-6 text-slate-700">
              <div>
                <div className="font-semibold text-slate-900">Is LNF</div>
                <div>{selectedLNF.is_lnf ? 'Yes' : 'No'}</div>
              </div>

              <div>
                <div className="font-semibold text-slate-900">Issue</div>
                <div>{selectedLNF.issue || 'No issue provided.'}</div>
              </div>

              <div>
                <div className="font-semibold text-slate-900">Why it fails</div>
                <div>{selectedLNF.why_it_fails || 'No reasoning provided.'}</div>
              </div>

              <div>
                <div className="font-semibold text-slate-900">Impact</div>
                <div>{selectedLNF.impact || 'No impact provided.'}</div>
              </div>

              <div>
                <div className="font-semibold text-slate-900">One sentence reason</div>
                <div>{selectedLNF.one_sentence_reason || 'No short reason provided.'}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LNF_Result;