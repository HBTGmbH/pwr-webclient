import {ProfileReducer} from '../src/reducers/profile/profile-reducer';
import {Profile} from '../src/model/Profile';
import {AbstractAction} from '../src/reducers/profile/database-actions';
import {ProfileActionCreator} from '../src/reducers/profile/ProfileActionCreator';
import {ProfileElementType, RequestStatus} from '../src/Store';
import {CreateEntryAction, SaveEntryAction} from '../src/reducers/profile/database-actions';
import {EducationEntry} from '../src/model/EducationEntry';
import {NameEntity} from '../src/model/NameEntity';
import {AdminNotification, APIAdminNotification} from '../src/model/admin/AdminNotification';
import {AdminReducer} from '../src/reducers/admin/AdminReducer';
import {AdminActionCreator} from '../src/reducers/admin/AdminActionCreator';
import {ReceiveNotificationsAction} from '../src/reducers/admin/admin-actions';
import {doop} from 'doop';

//== The following tests validate that arbitrary entries may be added into the profile. ==//


/**
 * A training entry has to be addable to a default profile. After the reudcer has been called,
 * the profile instance must not be the same as the instance given to the reducer and the entry
 * has to be added.
 */
test('Creates a training entry and adds it to a default profile', () => {
    let action: CreateEntryAction = ProfileActionCreator.createEntry(ProfileElementType.TrainingEntry);
    let profile: Profile = Profile.createDefault();
    let resultProfile = ProfileReducer.reducerHandleCreateEntry(profile, action);
    expect(resultProfile === profile).toBeFalsy();
    expect(resultProfile.trainingEntries().count()).toBe(1);
});


/**
 * A training entry has to be addable to a default profile. After the reudcer has been called,
 * the profile instance must not be the same as the instance given to the reducer and the entry
 * has to be added.
 */
test('Creates a qualification entry and adds it to a default profile', () => {
    let action: CreateEntryAction = ProfileActionCreator.createEntry(ProfileElementType.QualificationEntry);
    let profile: Profile = Profile.createDefault();
    let resultProfile = ProfileReducer.reducerHandleCreateEntry(profile, action);
    expect(resultProfile === profile).toBeFalsy();
    expect(resultProfile.qualificationEntries().count()).toBe(1);
});

test('Creates a sector entry and adds it to a default profile', () => {
    let action: CreateEntryAction = ProfileActionCreator.createEntry(ProfileElementType.SectorEntry);
    let profile: Profile = Profile.createDefault();
    let resultProfile = ProfileReducer.reducerHandleCreateEntry(profile, action);
    expect(resultProfile === profile).toBeFalsy();
    expect(resultProfile.sectorEntries().count()).toBe(1);
});


test('Creates a education entry and adds it to a default profile', () => {
    let action: CreateEntryAction = ProfileActionCreator.createEntry(ProfileElementType.EducationEntry);
    let profile: Profile = Profile.createDefault();
    let resultProfile = ProfileReducer.reducerHandleCreateEntry(profile, action);
    expect(resultProfile === profile).toBeFalsy();
    expect(resultProfile.educationEntries().count()).toBe(1);
});


test('Creates a language entry and adds it to a default profile', () => {
    let action: CreateEntryAction = ProfileActionCreator.createEntry(ProfileElementType.LanguageEntry);
    let profile: Profile = Profile.createDefault();
    let resultProfile = ProfileReducer.reducerHandleCreateEntry(profile, action);
    expect(resultProfile === profile).toBeFalsy();
    expect(resultProfile.languageSkills().count()).toBe(1);
});

// == The following methods check that adding entries to non-default profiles work.

/**
 * Tests non-default behaviour by adding multiple language skills into a profile.
 * This is the way the reducer works and is usually initialized. The other possible way to by creating
 * it from an API profile.
 */
test('Validates that multiple language skills may be added to a profile', () => {
   let profile: Profile = Profile.createDefault();
   let actions: Array<CreateEntryAction> = [];
   const actionCount = 10;
   for(let i = 0; i < actionCount; i++) {
        actions.push(ProfileActionCreator.createEntry(ProfileElementType.LanguageEntry));
   }
   actions.forEach(a =>  {
       let tmpProfile: Profile = ProfileReducer.reducerHandleCreateEntry(profile,a);
       expect(tmpProfile === profile).toBeFalsy();
        profile = tmpProfile;
   });
   expect(profile.languageSkills().count()).toEqual(actionCount);
});


test('Validates that existing, \'new\' education entry may be added without a NameEntity', () => {
    let profile: Profile = Profile.createDefault();
    let educationEntry: EducationEntry = EducationEntry.createNew();
    let action: SaveEntryAction = ProfileActionCreator.saveEntry(educationEntry, null, ProfileElementType.EducationEntry);
    profile = ProfileReducer.reducerUpdateEntry(profile, action);
    expect(profile.educationEntries().count()).toBe(1);
    expect(profile.educationEntries().values()).toContainEqual(educationEntry);

});

@doop
class Dimensions {
    @doop public get height() {return doop<number, this>()};
    @doop public get width() {return doop<number, this>()};

    constructor(height: number, width: number) {
        return this.height(height).width(width);
    }

    public area() {
        return this.height() * this.width();
    }
}

@doop
class Cube {
    @doop public get name() {return doop<string, this>()};
    @doop public get dimensions() {return doop<Dimensions, this>()};

    constructor(name: string, dimensions: Dimensions) {
        return this.name(name).dimensions(dimensions);
    }
}


let dimensions = new Dimensions(1, 2);
let cube = new Cube("MyCube", dimensions);

let newCube = cube.name("MyNewCube");

let newCube2 = cube.dimensions(cube.dimensions().width(44));


console.log(cube);
console.log(newCube);



/*
test('Validates that existing education entries with a NameEntity may be aded and that the ID is correctly set', () => {
    let profile: Profile = Profile.createDefault();
    let educationEntry: EducationEntry = EducationEntry.createNew();
    let nameEntity: NameEntity = NameEntity.createNew("TestEntity");
    // modify the entry to mimic an arbitrary, existing one.
    educationEntry = educationEntry.id("5");
    educationEntry = educationEntry.isNew(false);
    educationEntry = educationEntry.degree("Master");
    let action1: SaveEntryAction = ProfileActionCreator.saveEntry(educationEntry, nameEntity, ProfileElementType.EducationEntry);
    profile = ProfileReducer.reducerUpdateEntry(profile, action1);
    // Entries are immutable, using the accessor will result in a copy.
    // That way a good deep equal expectation can be created.
    let expectedEntry: EducationEntry = educationEntry.nameEntityId(nameEntity.id());
    expect(profile.educationEntries().count()).toEqual(1);
    console.log(JSON.stringify(profile.educationEntries().values()));
    expect(profile.educationEntries().values()).toContainEqual(expectedEntry);

});*/