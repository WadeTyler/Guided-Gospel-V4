import { useState, useEffect } from 'react';
import { bookNames } from '../constants/bibleoptions'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { IconChevronRight } from '@tabler/icons-react';
import { IconChevronLeft } from '@tabler/icons-react';
import { motion } from 'framer-motion';


interface Verse {
    verseid: string,
    chapterid: number,
    verseNum: number,
    text: string
};

type Chapter = {
  chapterid: number,
  bookid: number,
  chapterNum: number
}

const fontSizes = [
  { size: 'xs', name: 'Extra Small' },
  { size: 'sm', name: 'Small' },
  { size: 'md', name: 'Medium' },
  { size: 'lg', name: 'Large' },
  { size: 'xl', name: 'Extra Large' },
  { size: '2xl', name: 'Super Large' },
]


const Bible = () => {

  const queryClient = useQueryClient();

  const [currentBook, setCurrentBook] = useState<string>(localStorage.getItem('currentBook') || '');
  const [currentChapter, setCurrentChapter] = useState<number>(localStorage.getItem('currentChapter') !== null ? parseInt(localStorage.getItem('currentChapter') as string) : 1);
  const [currentFontSize, setCurrentFontSize] = useState<string>(localStorage.getItem('fontSize') || 'md');
  const [wideMode, setWideMode] = useState<boolean>(localStorage.getItem('wideMode') === 'true' || false);

  const { data:chapters } = useQuery({
    queryKey: ['chapters'],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/bible/${currentBook}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message);
        }

        return data;

      } catch (error) {
        toast.error((error as Error).message || "Something went wrong");
        throw new Error((error as Error).message || "Something went wrong");
      }
    }
  })

  const { data:verses } = useQuery({
    queryKey: ['verses'],
    queryFn: async () => {
      try {

        // If the verses are in local storage, return them from local storage
        const localVerses = localStorage.getItem('book' + currentBook + 'chapter' + currentChapter);
        if (localVerses) {
          console.log('Retrieving verses local storage');
          return JSON.parse(localVerses);
        }

        // If the verses are not in local storage, fetch them from the server
        const response = await fetch(`/api/bible/${currentBook}/${currentChapter}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }

        // Save the verses in local storage
        const versesString = JSON.stringify(data);
        localStorage.setItem('book' + currentBook + 'chapter' + currentChapter, versesString);

        return data;
      } catch (error) {
        toast.error((error as Error).message || "Something went wrong");
        throw new Error((error as Error).message || "Something went wrong");
      }
    }
  })

  useEffect(() => {
    localStorage.setItem('fontSize', currentFontSize);
  }, [currentFontSize])

  useEffect(() => {
    localStorage.setItem('wideMode', wideMode.toString());
  }, [wideMode])

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['verses'] });
    localStorage.setItem('currentChapter', currentChapter.toString());
  }, [currentChapter])

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['chapters'] });
    queryClient.invalidateQueries({ queryKey: ['verses'] });

    const localBook = localStorage.getItem('currentBook');


    if (currentBook !== localBook) {
      localStorage.setItem('currentBook', currentBook);
      setCurrentChapter(1);
    }

  }, [currentBook])

  const nextPage = () => {
    if (currentChapter < chapters.length) {
      setCurrentChapter(currentChapter + 1);
    }
    else {
      toast.error("You have reached the last chapter");
    }
  }

  const previousPage = () => {
    if (currentChapter > 1) {
      setCurrentChapter(currentChapter - 1);
    }
    else {
      toast.error("You're at the beginning of this book");
    }
  }

  return (
    <div className="flex items-center justify-center flex-col">
      
      <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`${wideMode ? 'w-10/12' : 'w-[40rem]'} fixed top-12`}>
        <div className="border-b-primary border-b-2 flex items-center flex-col pb-4 mb-4 w-full">
          <h1 className="text-4xl text-primary">Guided Gospel</h1>
        </div>

        <div className="flex gap-4 w-full">
            <div className='flex flex-col w-full'>
              <label htmlFor="book" className='pl-3'>Book:</label>
              <select name="book" id="book" className="form-input-bar"
              onChange={(e) => {
                setCurrentBook(e.target.value);
              }}
              value={currentBook}
              >
                {bookNames.map((name, index) => (
                <option key={index}>{name}</option>
                ))}
              </select>
            </div>
            <div className='flex flex-col w-full'>
              <label htmlFor="chapter" className='pl-3'>Chapter:</label>
              <select name="chapter" id="chapter" className="form-input-bar"
              onChange={(e) => {
                setCurrentChapter(parseInt(e.target.value));
              }}
              disabled={!currentBook}
              value={currentChapter}
              >
                {chapters && chapters.length > 0 &&
                  chapters.map((chapter: Chapter, index: number) => (
                    <option key={index}>{chapter.chapterNum}</option>
                  ))
                }
                
              </select>
            </div>
            <div className='flex flex-col w-full'>
              <label htmlFor="fontsize" className='pl-3'>Font Size:</label>
              <select name="fontsize" id="fontsize" className="form-input-bar"
              onChange={(e) => setCurrentFontSize(e.target.value)}
              value={currentFontSize}
              >
                {fontSizes.map((fontsize, index: number) => (
                <option value={fontsize.size} key={index} >{fontsize.name}</option>
                ))}
              </select>
            </div>
            <div className='flex flex-col w-full'>
              <label htmlFor="widemode" className='pl-3'>Wide Mode:</label>
              <input type="checkbox" className='border-primary border-[1px] rounded-2xl text-zinc-500 w-full hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 focus:border-primary h-10' 
              onChange={(e) => setWideMode(e.target.checked)}
              checked={wideMode}
              />
            </div>
        </div>
      </motion.header>
      
      {/* Display Verses */}
      {verses && 
        <div className={`${wideMode ? 'w-10/12' : 'w-[40rem]'} h-[30rem] flex flex-col mt-52 overflow-y-auto`}>
          {currentBook && currentChapter && 
            <h2 className="text-3xl text-neutral-800">{currentBook} - {currentChapter}</h2>
          }
          {verses.map((verse: Verse, index: number) => (
            <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            key={index} className={`border-b-2 border-gray-200 p-2 flex gap-2 text-${currentFontSize}`}>
              <p className="">{verse.verseNum}</p>
              <p className="">{verse.text}</p>
            </motion.div>
          ))}
        </div>
      }
      {verses && currentBook && currentChapter && 
        <>
          <button onClick={nextPage}
            className={`absolute ${!wideMode ? 'right-1/4' : 'right-14'} translate-x-1/2 top-1/2 text-primary hover:bg-neutral-800 transition-all duration-300 ease-in-out p-1 rounded-full scale-150`}>
              <IconChevronRight />
          </button>

          <button onClick={previousPage}
            className={`absolute ${!wideMode ? 'left-1/4' : 'left-14'} -translate-x-1/2 top-1/2 text-primary hover:bg-neutral-800 transition-all duration-300 ease-in-out p-1 rounded-full scale-150`}>
              <IconChevronLeft />
          </button>
        </>
      }

      

    </div>
  )
}

export default Bible