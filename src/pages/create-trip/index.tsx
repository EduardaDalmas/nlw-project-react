import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InviteGuestsModal } from './invite-guests-modal';
import { ConfirmTripModal } from './confirm-trip-modal';
import { DestinationAnDateStep } from './steps/destination-and-date-step';
import { InviteGuestsStep } from './steps/invite-guests-step';
import { DateRange } from 'react-day-picker';
import { api } from '../../lib/axios';

export function CreateTripPage() {
  const navigate = useNavigate();

  const [isGuestsInputOpen, setIsGuestsInputOpen] = useState(false);
  const [isGuestsModalOpen, setIsGuestsModalOpen] = useState(false);
  const [isConfirmTripModalOpen, setIsConfirmModalOpen] = useState(false);

  const [destination, setDestination] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [eventStartAndEndDates, setEventStartAndEndDates] = useState<DateRange | undefined>();
  
  const [emailsToInvite, setEmaiToInvite] = useState([
    'eduardadalmas@outlook.com',
    'dalmasduda@gmail.com',
  ]);
 

  function openGuestsInput() {
    setIsGuestsInputOpen(true);
  }

  function closeGuestsInput() {
    setIsGuestsInputOpen(false);
  }

  function openGuestsModal() {
    setIsGuestsModalOpen(true);
  }

  function closeGuestsModal() {
    setIsGuestsModalOpen(false);
  }

  function addNewEmailToInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const email = data.get('email')?.toString()

    if (!email) {
      return;
    }

    if (emailsToInvite.includes(email)) {
      alert('Esse e-mail já foi adicionado!');
      return;
    }

    setEmaiToInvite([...emailsToInvite, email]);
    
    event.currentTarget.reset();
  }

  function removeEmailToInvites(emailToRemove: string) {
    const newEmailList = emailsToInvite.filter(emailItem => emailItem !== emailToRemove);

    setEmaiToInvite(newEmailList);
  }

  function openConfirmTripModal() {
    setIsConfirmModalOpen(true);
  }

  function closeConfirmTripModal() {
    setIsConfirmModalOpen(false);
  }

  async function createTrip(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(destination)
    console.log(ownerName)
    console.log(ownerEmail)
    console.log(eventStartAndEndDates)
    console.log(emailsToInvite)

    if (!destination) {
      return
    }

    if (!eventStartAndEndDates?.from || !eventStartAndEndDates?.to) {
      return
    }

    if (emailsToInvite.length === 0) {
      return 
    } 

    if (!ownerEmail || !ownerName) {
      return
    }

    const response = await api.post('/trips',  {
      destination,
      starts_at: eventStartAndEndDates.from,
      ends_at: eventStartAndEndDates.to,
      emails_to_invite: emailsToInvite,
      owner_name: ownerName,
      owner_email: ownerEmail
    })

    const { tripId } = response.data;

    navigate(`/trips/${tripId}`);
  }

  return (
   <div className="h-screen flex items-center justify-center bg-pattern bg-no-repeat bg-center">
     <div className="max-w-3xl w-full px-6 text-center space-y-10">
      <div className='flex flex-col items-center gap-3'>
        <img src="/logo.svg" alt="Plann.er" />
        <p className="text-zinc-300 text-lg">Convide seus amigos e planeje sua próxima viagem!</p>
      </div>
     
    <div className='space-y-4'>
      <DestinationAnDateStep 
        closeGuestsInput={closeGuestsInput} 
        openGuestsInput={openGuestsInput}
        isGuestsInputOpen={isGuestsInputOpen}
        setDestination={setDestination}
        eventStartAndEndDates={eventStartAndEndDates}
        setEventStartAndEndDates={setEventStartAndEndDates}
      />

      {isGuestsInputOpen && (
        <InviteGuestsStep 
          emailsToInvite={emailsToInvite}
          openGuestsModal={openGuestsModal}
          openConfirmTripModal={openConfirmTripModal}
        />
      )}
    </div>

    <p className="text-sm text-zinc-500">
      Ao planejar sua viagem pela plann.er você automaticamente concorda <br />
      com nossos <a className="text-zinc-300 underline" href="#">termos de uso</a> e <a className="text-zinc-300 underline" href="#">políticas de privacidade</a>.
    </p>
  </div>

    {isGuestsModalOpen && (
      <InviteGuestsModal 
        emailsToInvite={emailsToInvite} 
        addNewEmailToInvite={addNewEmailToInvite}
        closeGuestsModal={closeGuestsModal}
        removeEmailToInvites={removeEmailToInvites}
      />
    )}

    {isConfirmTripModalOpen && (
      <ConfirmTripModal 
        closeConfirmTripModal={closeConfirmTripModal} 
        createTrip={createTrip}
        setOwnerName={setOwnerName}
        setOwnerEmail={setOwnerEmail}
      />
    )}

   </div>
  )
}

