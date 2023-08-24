import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import ReactDOM from 'react-dom';
import { withStyles } from '@material-ui/core/styles';
import ReactHtmlParser from 'react-html-parser';
import { useSnackbar } from 'notistack';
import queryString from 'query-string';
import MobileDetect from 'mobile-detect';
import { Select, MenuItem, CircularProgress } from '@material-ui/core';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
// import socket from '../../socket/socketConfig';
import interactionPlugin from '@fullcalendar/interaction';
import ProvidersCheckBoxes from './components/ProvidersCheckboxes';
import UncheckedList from './components/UncheckedList';
import CalendarDatePicker from '../../components/CalendarDatePicker';
import AvailabilityModal from './components/AvailabilityModal';
import AppointmentModal from './components/AppointmentModal';
import ProviderToolTip from './components/Tooltips';
import MenuIcon from '@material-ui/icons/Menu';

import './styles.scss';
//import './components/daystyle.css';

import {
  transformAppointmentToFullCalendarEvent,
  transformAvailabilityToFullCalendarEvent,
  dateTransform,
  transformToServerEvent,
} from './utils';
import {
  fetchAdminAvailability,
  createAvailability,
  deleteAvailability,
  cancelAppointmentFromAdmin,
} from '../../services/api/admin';
import {
  fetchCurrentPractice,
  fetchCurrentUser,
} from '../../services/api/auth';
import {
  fetchProviderAppointments,
  removeDependentInDateBook,
  fetchFullProviderDateBook,
  createProviderViewDateBookList,
} from '../../services/api';

function DayView(props) {
  const {
    location,
    history,
    classes: { mainWrapper, main, mainLoading },
  } = props;

  //Auto-refresh fetchAdminAvailability and fetchAppointments using Socket.io
  // const socketUpdate = data => {
  //   console.log('two-dayview--Ids', data.id, currentUserId && currentUserId.id);
  //   if (data.id === currentUserId.id) {
  //     if (data.message === 'auto-refresh-Availability') {
  //       return fetchAvailabilities();
  //     } else {
  //       intialCall();
  //       return fetchAppointments();
  //     }
  //   }
  // };

  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(true);
  const [providersById, setProvidersById] = useState({});
  const [finishedGettingProviders, setFinished] = useState(false);
  const [providerCalRefs, setProviderCalRefs] = useState({});
  const [providerDateBook, setProviderDateBook] = useState({});
  const [filterList, setFilterList] = useState({});
  const [viewableDateRange, setViewableDateRange] = useState(null);
  const [toggle, setToggle] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');
  /*
  example: {
    <PROVIDER_UUID>: [APPOINTMENT_EVENT, ...],
    ...
  }
   */
  const [appointmentEvents, setAppointmentEvents] = useState({});

  /*
  example: {
    <PROVIDER_UUID>: [AVAILABILITY_EVENT, ...],
    ...
  }
  */
  const [availabilityEvents, setAvailabilityEvents] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openAvailabilityModal, setOpenAvailabilityModal] = useState(false);
  const [openAppointmentModal, setOpenAppointmentModal] = useState(false);
  const [selectedAvailability, setSelectedAvailability] = useState({
    providerId: '',
    tenancyId: '',
    start: dateTransform(new Date()),
    end: dateTransform(new Date()),
    availability: false,
  });
  const [selectedAppt, setSelectedAppt] = useState({
    id: '',
    time: '',
    durationMinutes: 0,
    tenancyLocation: '',
    tenancyId: '',
    patientId: '',
    patientName: '',
    patientDOB: '',
    patientEmail: '',
    patientPhone: '',
    providerFullTitle: '',
  });
  const [providerId, setProviderId] = useState([]);

  useEffect(() => {
    (async () => {
      intialCall();
      const user = await fetchCurrentUser();
      setCurrentUserId(user);
    })();
  }, [selectedDate]);

  const filterListUpdate = data => {
    setFilterList(data);
  };

  const intialCall = async () => {
    setIsLoading(true);
    const { providers } = await fetchCurrentPractice();
    const dateBookList = await fetchFullProviderDateBook(selectedDate);
    if (dateBookList.length === 0) {
      createDateBook(dateBookList, providers);
    }
    const filteredIds = filterSelectOption(providers, dateBookList);
    setFilterList(filteredIds);
    convertProvidersToIdMap(filteredIds);
    let urlParams = location.search;
    if (!urlParams.length && md.mobile()) {
      // const { provider } = await fetchCurrentUser();
      urlParams = setQueryParams([...dateBookList]);
    } else if (!urlParams.length) {
      urlParams = setQueryParams([...dateBookList]);
    }
    const checkedIds = Object.values(queryString.parse(urlParams));
    convertIdsToCalRefMap(checkedIds);
    setFinished(true);
    setIsLoading(false);
  };

  /*
   * The viewableDateRange is set for the first time by calendar rendering;
   * the finishedGettingProviders variable is set to true after providersByID
   * is set in the first useEffect. Therefore, the useEffect below circumvents
   * a race condition.
   */
  useEffect(() => {
    (async () => {
      if (viewableDateRange && finishedGettingProviders) {
        setIsLoading(true);
        fetchAvailabilities();
        fetchAppointments();
        setIsLoading(false);
        // socket.off('message').on('message', data => {
        //   socketUpdate(data);
        //   // intialCall();
        // });
      }
    })();
  }, [viewableDateRange, finishedGettingProviders]);

  const createDateBook = (dateBook, providers) => {
    try {
      if (dateBook.length === 0) {
        const size = 2;
        const items = providers?.slice(0, size);
        items.forEach(async provider => {
          const { id } = provider;
          await createAndFetchDateBookedList(id);
        });
      }
    } catch (error) {
      enqueueSnackbar(`oops something went wrong`);
    }
  };

  const filterSelectOption = (totalOpt, selectedOpt) => {
    let filterArr = [];
    let checkedProIdList = [];
    totalOpt.map(async (item, i) => {
      let isExist = selectedOpt.filter(x => x.id === item.id);
      if (isExist > -1) {
        item.isChecked = false;
        item.apptCount = 0;
        filterArr.push(item);
      } else {
        item.isChecked = true;
        item.apptCount = isExist[0].apptCount;
        checkedProIdList.push(item);
      }
    });
    const finalSelectedArray = [...filterArr, ...checkedProIdList];
    return finalSelectedArray;
  };

  const convertProvidersToIdMap = providers => {
    const providerIdMap = {};
    //setProviderId
    const uniqueId = [];
    providers.map(provider => {
      uniqueId.push(provider.id);
    });
    setProviderId(uniqueId);
    providers.forEach(provider => {
      const { id } = provider;
      providerIdMap[id] = provider;
    });
    setProvidersById(providerIdMap);
  };

  const convertIdsToCalRefMap = ids => {
    const providerCalendarMap = {};
    ids.forEach(id => {
      providerCalendarMap[id] = React.createRef();
    });
    setProviderCalRefs(providerCalendarMap);
  };

  const setQueryParams = providerDateBook => {
    const queryStr = ['?'];
    for (
      let i = 0;
      // i < Math.min(providers.length, providerDateBook.length);
      i < providerDateBook.length;
      i++
    ) {
      // const { id } = providers[i];
      const { id } = providerDateBook[i];
      if (queryStr.length === 1) {
        queryStr.push(`provider_id_${i + 1}=${id}`);
      } else {
        queryStr.push(`&provider_id_${i + 1}=${id}`);
      }
    }
    history.push({ search: queryStr.join('') });
    return queryStr.join('');
  };

  const getIdsFromUrlParams = (filterVal = null) => {
    const parsed = queryString.parse(location.search);
    const ids = [];
    Object.keys(parsed).forEach(key => {
      if (parsed[key] !== filterVal) ids.push(parsed[key]);
    });
    return ids;
  };

  const md = new MobileDetect(window.navigator.userAgent);
  const checkedProviderIds = getIdsFromUrlParams();
  const firstCheckedProvId = checkedProviderIds[0];
  const firstProvEvents = [
    ...(appointmentEvents[firstCheckedProvId] || []),
    ...(availabilityEvents[firstCheckedProvId] || []),
  ];
  const providerIds = Object.keys(providersById);
  const MAX_CHECKED = 10;

  const fetchAppointments = async () => {
    try {
      let appointments = {};
      let startOfWeek = moment(viewableDateRange.start)
        .startOf('week')
        .toDate();
      let endOfWeek = moment(viewableDateRange.start)
        .endOf('week')
        .toDate();
      // let startOfWeek = moment(viewableDateRange.start)
      //   .startOf('day')
      //   .toDate();
      // let endOfWeek = moment(viewableDateRange.start)
      //   .add(2, 'day')
      //   .toDate();
      for (let id of checkedProviderIds) {
        const providerAppointments = await fetchProviderAppointments(
          id,
          // viewableDateRange.start,
          // viewableDateRange.end
          startOfWeek,
          endOfWeek
        );

        const transformedEvents = providerAppointments.map(
          transformAppointmentToFullCalendarEvent
        );
        appointments[id] = transformedEvents;
      }
      setAppointmentEvents(appointments);
    } catch (err) {
      //todo add err logging here
      enqueueSnackbar('Fetching Booked Appointments failed. Please try again.');
    }
  };

  const fetchAvailabilities = async () => {
    try {
      let availabilities = {};
      for (let id of checkedProviderIds) {
        const provider = providersById[id];
        const providerAvailabilities = await fetchAdminAvailability({
          provider,
          dateRange: viewableDateRange,
        });

        const transformedEvents = providerAvailabilities.map(
          transformAvailabilityToFullCalendarEvent
        );
        availabilities[id] = transformedEvents;
      }

      setAvailabilityEvents(availabilities);
    } catch (err) {
      console.log('error>><>>', err);
      enqueueSnackbar('Fetching Availability failed. Please try again.');
    }
  };

  /**
   * @param {UUID} id - provider id
   * @param {BOOLEAN} checkedState - are they "checked" / whether to display their schedule
   */
  const toggleCheckbox = async (id, checkedState) => {
    const numChecked = checkedProviderIds.length;
    if (checkedState) {
      createAndFetchDateBookedList(id);
      const parsedQueryStr = queryString.parse(location.search);
      const key = `provider_id_${checkedProviderIds.length + 1}`;
      parsedQueryStr[key] = id;
      history.push({ search: queryString.stringify(parsedQueryStr) });
      setProviderCalRefs({
        ...providerCalRefs,
        [id]: React.createRef(),
      });
    } else if (numChecked === 1)
      enqueueSnackbar(`Minimum 1 schedule at a time.`);
    else {
      removeAndFetchDateBookedList(id);
      const updatedQueryParams = getIdsFromUrlParams(id);
      const queryStr = ['?'];
      for (let i = 0; i < updatedQueryParams.length; i++) {
        const providerId = updatedQueryParams[i];
        if (i > 0) {
          queryStr.push('&');
        }
        queryStr.push(`provider_id_${i + 1}=${providerId}`);
      }
      history.push({ search: queryStr.join('') });
      const updatedProviderCalRefs = { ...providerCalRefs };
      delete updatedProviderCalRefs[id];
      setProviderCalRefs(updatedProviderCalRefs);
    }
  };

  const createAndFetchDateBookedList = async id => {
    try {
      await createProviderViewDateBookList(id);
      intialCall();
    } catch (error) {
      enqueueSnackbar(`oops something went wrong`);
    }
  };

  const removeAndFetchDateBookedList = async id => {
    try {
      await removeDependentInDateBook(id);
    } catch (error) {
      enqueueSnackbar(`oops something went wrong`);
    }
  };

  const handleDateChange = date => {
    setSelectedDate(date);
    checkedProviderIds.forEach(id => {
      const ref = providerCalRefs[id];
      const calendarApi = ref?.current.getApi();
      calendarApi.gotoDate(date);
    });
  };

  const calendarAvailabilitySelected = (event, selectedProviderId) => {
    const { extendedProps = {} } = event;
    const { tenancyId = '', providerId = selectedProviderId } = extendedProps;
    setSelectedAvailability({
      ...selectedAvailability,
      start: dateTransform(event.start),
      end: dateTransform(event.end),
      tenancyId,
      providerId,
    });
    setOpenAvailabilityModal(true);
  };

  const calendarAppointmentSelected = (event, selectedProviderId) => {
    const { extendedProps = {} } = event;
    const {
      tenancyLocation = '',
      tenancyId = '',
      providerFullTitle = '',
      patientId = '',
      patientName = '',
      patientDOB = '',
      patientEmail = '',
      patientPhone = '',
      providerId = selectedProviderId,
    } = extendedProps;

    setSelectedAppt({
      ...selectedAppt,
      time: event.start,
      durationMinutes:
        (new Date(event.end).getTime() - new Date(event.start).getTime()) /
        1000 /
        60,
      id: event.id,
      tenancyLocation,
      providerId,
      tenancyId,
      patientId,
      patientName,
      providerFullTitle,
      patientEmail,
      patientPhone,
      patientDOB,
    });
    setOpenAppointmentModal(true);
  };

  const onCalendarClicked = (info, providerId) => {
    const { event } = info;
    if (event.extendedProps && event.extendedProps.availability) {
      calendarAvailabilitySelected(event, providerId);
    }
    if (event.extendedProps && event.extendedProps.appointment) {
      calendarAppointmentSelected(event, providerId);
    }
  };

  const onSave = async () => {
    setIsLoading(true);
    try {
      if (
        moment(selectedAvailability.start).isSameOrAfter(
          moment(selectedAvailability.end)
        )
      ) {
        enqueueSnackbar(`Availability 'Start Time' must be before 'End Time.'`);
      } else {
        await createAvailability(transformToServerEvent(selectedAvailability));
        const { providerId } = selectedAvailability;
        const transformedAvailEvt = transformAvailabilityToFullCalendarEvent(
          selectedAvailability
        );
        const availEvtsList = availabilityEvents[providerId];
        availEvtsList.push(transformedAvailEvt);
        setAvailabilityEvents({
          ...availabilityEvents,
          [providerId]: availEvtsList,
        });
        onClose();
        // socket.emit('message', {
        //   message: 'auto-refresh-Availability',
        //   id: currentUserId && currentUserId.id,
        // });
      }
    } catch (err) {
      enqueueSnackbar(`Creating Availability failed. Please try again.`);
    }
    setIsLoading(false);
  };

  const onDelete = async () => {
    setIsLoading(true);
    try {
      await deleteAvailability(transformToServerEvent(selectedAvailability));
      const { providerId } = selectedAvailability;
      const updatedProviderAvailEvts = availabilityEvents[providerId].filter(
        availabilityEvent => {
          return (
            JSON.stringify(availabilityEvent) !==
            JSON.stringify(selectedAvailability)
          );
        }
      );
      setAvailabilityEvents({
        ...availabilityEvents,
        [providerId]: updatedProviderAvailEvts,
      });
      onClose();
      // socket.emit('message', {
      //   message: 'auto-refresh-Availability',
      //   id: currentUserId && currentUserId.id,
      // });
    } catch (err) {
      enqueueSnackbar('Deleting Availability failed. Please try again.');
    }
    setIsLoading(false);
  };

  const cancelAppointment = async () => {
    const appointmentId = selectedAppt.id;

    setIsLoading(true);
    try {
      await cancelAppointmentFromAdmin(appointmentId);
      const { providerId } = selectedAppt;
      const updatedProviderApptEvts = appointmentEvents[providerId].filter(
        event => event.id !== appointmentId
      );

      setAppointmentEvents({
        ...appointmentEvents,
        [providerId]: updatedProviderApptEvts,
      });

      onClose();
    } catch (err) {
      enqueueSnackbar('Failed to cancel appointment. Please try again.');
    }
    setIsLoading(false);
  };

  const onClose = () => {
    setSelectedAvailability({
      start: '',
      end: '',
      providerId: '',
      tenancyId: '',
    });
    setSelectedAppt({
      start: '',
      end: '',
      tenancyLocation: '',
      tenancyId: '',
      patientId: '',
      patientName: '',
      providerFullTitle: '',
      patientDOB: '',
      patientEmail: '',
      patientPhone: '',
    });
    setOpenAvailabilityModal(false);
    setOpenAppointmentModal(false);
  };

  const onTimeChange = (type, time) => {
    const dateTime = moment(time);
    setSelectedAvailability({
      ...selectedAvailability,
      [type]: dateTime.toDate(),
    });
  };

  const onTenancyChange = tenancyId => {
    setSelectedAvailability({
      ...selectedAvailability,
      tenancyId,
    });
  };

  const showToggle = () => {
    setToggle(!toggle);
    if (toggle === true) {
      const get = document.getElementById('menu-bar');
      get.style.display = 'block';
      document.getElementById('contentBox').style.width = 'calc(100% - 255px)';
    } else {
      const get = document.getElementById('menu-bar');
      get.style.display = 'none';
      document.getElementById('contentBox').style.width = '100%';
    }
  };

  return isLoading ? (
    <div className={mainWrapper}>
      <div className={mainLoading}>
        <Select className="menu-button" value="Day View">
          <MenuItem
            component={Link}
            to="/admin/schedule/weekview"
            value="Week View"
          >
            Week View
          </MenuItem>
          <MenuItem
            component={Link}
            to="/admin/schedule/dayview"
            value="Day View"
          >
            Day View
          </MenuItem>
        </Select>
        <CircularProgress size="20px" />
      </div>
    </div>
  ) : (
    <div className={mainWrapper}>
      <div className={main}>
        <div className="toogle-bar" onClick={showToggle}>
          <MenuIcon />
        </div>
        <div className="menu-bar">
          <Select className="menu-button" value="Day View">
            <MenuItem
              component={Link}
              to="/admin/schedule/weekview"
              value="Week View"
            >
              Week View
            </MenuItem>
            <MenuItem
              component={Link}
              to="/admin/schedule/dayview"
              value="Day View"
            >
              Day View
            </MenuItem>
          </Select>
          {checkedProviderIds.length < providerIds.length && (
            <UncheckedList
              providerIds={providerIds}
              filterList={filterList}
              providerCalRefs={providerCalRefs}
              providersById={providersById}
              toggleCheckbox={toggleCheckbox}
              filterListUpdate={data => filterListUpdate(data)}
            />
          )}
        </div>
        <ProvidersCheckBoxes
          MAX_CHECKED={MAX_CHECKED}
          toggleCheckbox={toggleCheckbox}
          filterList={filterList}
          selectedDate={selectedDate}
          // checkedProviderIds={providerId}
          checkedProviderIds={checkedProviderIds}
          providerCalRefs={providerCalRefs}
          providersById={providersById}
          filterListUpdate={data => filterListUpdate(data)}
        />
        <CalendarDatePicker
          selectedDate={selectedDate}
          handleDateChange={handleDateChange}
          autoOk={true}
          label="Select a date"
        />
        <div className='main-div-calendar'>
        <div className="providers-title-container">
          {checkedProviderIds.map(id => {
            const provider = providersById[id];
            return (
              <ProviderToolTip
                key={`title-${id}`}
                title={provider && provider.name}
              >
                <div className="provider-title">
                  {provider && provider.name}
                </div>
              </ProviderToolTip>
            );
          })}
        </div>
        <div className="calendars-container custom-calender-view">
          <div className="scheduler-view" key={firstCheckedProvId}>
            <FullCalendar
              ref={providerCalRefs[firstCheckedProvId]}
              defaultDate={selectedDate}
              selectable
              timeZone="local"
              defaultView="timeGridDay"
              select={event => {
                calendarAvailabilitySelected(event, firstCheckedProvId);
              }}
              plugins={[timeGridPlugin, interactionPlugin]}
              minTime={'06:00:00'}
              maxTime={'23:00:00'}
              events={firstProvEvents}
              header={{
                left: '',
                center: '',
                right: '',
              }}
              allDaySlot={false}
              slotDuration={'01:00:00'}
              snapDuration={'00:10:00'}
              eventClick={event => {
                onCalendarClicked(event, firstCheckedProvId);
              }}
              datesRender={calEvent =>
                setViewableDateRange(
                  calEvent.view.props.dateProfile.activeRange
                )
              }
              eventRender={info => {
                const data = info.el.innerHTML;
                ReactDOM.render(
                  <>
                    {ReactHtmlParser(data)}
                    <div className="day-view">
                      <div className="tooltip">
                        <div>
                          {moment(info.event.start).format('hh:mm') +
                            '- ' +
                            moment(info.event.end).format('hh:mm') +
                            '-' +
                            info.event.title}
                        </div>
                      </div>
                    </div>
                  </>,
                  info.el
                );
                return info.el;
              }}
            />
          </div>
          {checkedProviderIds.map(providerId => {
            /*
             * availability/appointment events may or may not yet have the providerId
             * field initialized yet. Therefore, including " || [] " to save the case
             * where the code is attempting to spread an object that does not exist yet.
             */
            if (providerId !== firstCheckedProvId) {
              const thisProvidersEvents = [
                ...(appointmentEvents[providerId] || []),
                ...(availabilityEvents[providerId] || []),
              ];

              return (
                <div className="timeless-view" key={providerId}>
                  <FullCalendar
                    ref={providerCalRefs[providerId]}
                    defaultDate={selectedDate}
                    // handleWindowResize={true}
                    selectable
                    timeZone="local"
                    defaultView="timeGridDay"
                    // windowResize={handleSize}
                    select={event => {
                      calendarAvailabilitySelected(event, providerId);
                    }}
                    plugins={[timeGridPlugin, interactionPlugin]}
                    minTime={'06:00:00'}
                    maxTime={'23:00:00'}
                    events={thisProvidersEvents}
                    header={{
                      left: '',
                      center: '',
                      right: '',
                    }}
                    allDaySlot={false}
                    slotDuration={'01:00:00'}
                    snapDuration={'00:10:00'}
                    eventClick={event => {
                      onCalendarClicked(event, providerId);
                    }}
                    datesRender={calEvent =>
                      setViewableDateRange(
                        calEvent.view.props.dateProfile.activeRange
                      )
                    }
                    eventRender={info => {
                      const data = info.el.innerHTML;
                      ReactDOM.render(
                        <>
                          {ReactHtmlParser(data)}
                          <div className="day-view">
                            <div className="tooltip">
                              <div>
                                {moment(info.event.start).format('hh:mm') +
                                  '- ' +
                                  moment(info.event.end).format('hh:mm') +
                                  '-' +
                                  info.event.title}
                              </div>
                            </div>
                          </div>
                        </>,
                        info.el
                      );
                      return info.el;
                    }}
                  />
                </div>
              );
            }
          })}
        </div>
        </div>
        {openAvailabilityModal && (
          <AvailabilityModal
            open={openAvailabilityModal}
            selectedAvailability={selectedAvailability}
            provider={providersById[selectedAvailability.providerId]}
            tenancies={
              (providersById[selectedAvailability.providerId] &&
                providersById[selectedAvailability.providerId].tenancies) ||
              []
            }
            onClose={onClose}
            onSave={onSave}
            onDelete={onDelete}
            onEventStartChange={value => onTimeChange('start', value)}
            onEventEndChange={value => onTimeChange('end', value)}
            onTenancyChange={onTenancyChange}
          />
        )}
        {openAppointmentModal && (
          <AppointmentModal
            open={openAppointmentModal}
            onClose={onClose}
            apptCountUpdate={intialCall}
            currentProvider={providersById[selectedAppt.providerId]}
            selectedAppt={selectedAppt}
            cancelAppointment={cancelAppointment}
            refeshAppointments={fetchAppointments}
            currentUserId={currentUserId.id}
          />
        )}
      </div>
    </div>
  );
}

const styles = () => ({
  mainWrapper: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'white',
    overflow: 'scroll',
  },
  mainLoading: {
    width: '100%',
    height: '100%',
    padding: '2rem 2rem',
    display: 'flex',
    alignItems: 'center',
  },
  main: {
    width: '100%',
    height: '100%',
    padding: '2rem 2rem',
    paddingBottom: '5px',
    display: 'flex',
    flexDirection: 'column',
  },
});

export default withStyles(styles)(DayView);
