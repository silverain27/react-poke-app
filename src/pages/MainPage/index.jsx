import { useEffect, useState } from 'react'
import reactLogo from '../../assets/react.svg'
import viteLogo from '/vite.svg'
import axios from 'axios'
import PokeCard from '../../components/PokeCard'
import AutoComplete from '../../components/AutoComplete'

function MainPage() {
  //모든 포켓몬 데이터 
  const [allPokemons, setAllPokemons] = useState([])
  //실제 리스트로 보이는 포켓몬 데이터 
  const [displayedPokemons, setDisplayedPokemons] = useState([])

  const limitNum = 20;
  const url = `https://pokeapi.co/api/v2/pokemon/?limit=1008&offset=0`
  
  

  useEffect(() => {
    fetchPokeData();
  }, [])

  const filterDisplayedPokemonData = (allPokemonsData, displayedPokemons= []) => {
    const limit = displayedPokemons.length + limitNum;
    const array = allPokemonsData.filter((pokemon, index)=> index+1 <=limit)
    return array 
  }

  const fetchPokeData = async () => {
    try{
      //1008개를 포켓몬 데이터 받아오기 
      const response = await axios.get(url)
      
      //모든 포켓몬 데이터 기억하기 
      setAllPokemons(response.data.results)
      
      //실제 포켓몬 
      setDisplayedPokemons(filterDisplayedPokemonData(response.data.results))
    } catch(error){
      console.error(error)
    }
  }

  return (
  <article className='pt-6'>
    <header className='flex flex-col gap-2 w-full px-4 z-50'>
      <AutoComplete
        allPokemons={allPokemons} setDisplayedPokemons={setDisplayedPokemons}
        />
    </header>
    <section className='pt-6 flex flex-col justify-content items-center overflow-auto z-0'>
      <div className='flex flex-row flex-wrap gap-[16px] items-center justify-center px-2 max-w-4xl'>
        {displayedPokemons.length>0 ?
        (
        displayedPokemons.map(({url,name}, index)=>(
        <PokeCard key={url} url={url} name={name} />
        ))
        ):
        (
        <h2 className='font-medium text-lg text-slate-900 mb-1'>
          포켓몬이 없습니다.
        </h2>
        )}
      </div>
    </section>
    <div className='text-center'>
      {(allPokemons.length > displayedPokemons.length) && (displayedPokemons.length !==1)&&
      (
      <button onClick={()=>setDisplayedPokemons(filterDisplayedPokemonData(allPokemons,displayedPokemons))}
        className='bg-slate-800 px-6 py-2 y-4 text-base rounded-lg font-bold text-white'>
        더 보기
      </button>
      )
      }
    </div>

  </article>

  )
  }

export default MainPage
