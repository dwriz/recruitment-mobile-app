import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from "../screens/profile/ProfileScreen";
// import UserDetailScreen from "../screens/profile/userDetail/UserDetailScreen";
// import EditUserDetailScreen from "../screens/profile/userDetail/EditUserDetailScreen";
// import EducationDetailScreen from "../screens/profile/education/EducationDetailScreen";
// import CreateEducationScreen from "../screens/profile/education/CreateEducationScreen";
// import EditEducationScreen from "../screens/profile/education/EditEducationScreen";
// import ExperienceDetailScreen from "../screens/profile/experience/ExperienceDetailScreen";
// import CreateExperienceScreen from "../screens/profile/experience/CreateExperienceScreen";
// import EditExperienceScreen from "../screens/profile/experience/EditExperienceScreen";
// import SkillDetailScreen from "../screens/profile/skill/SkillDetailScreen";
// import CreateSkillScreen from "../screens/profile/skill/CreateSkillScreen";
// import EditSkillScreen from "../screens/profile/skill/EditSkillScreen";
// import ProfileAttachmentDetailScreen from "../screens/profile/profileAttachment/ProfileAttachmentDetailScreen";
// import ProfilePictureDetailScreen from "../screens/profile/profilePicture/ProfilePictureDetailScreen";
// import ChangePasswordScreen from "../screens/profile/changePassword/ChangePasswordScreen";

const Stack = createStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      {/* <Stack.Screen
        name="ProfilePictureDetailScreen"
        component={ProfilePictureDetailScreen}
      />
      <Stack.Screen name="UserDetailScreen" component={UserDetailScreen} />
      <Stack.Screen
        name="EditUserDetailScreen"
        component={EditUserDetailScreen}
      />
      <Stack.Screen
        name="EducationDetailScreen"
        component={EducationDetailScreen}
      />
      <Stack.Screen
        name="CreateEducationScreen"
        component={CreateEducationScreen}
      />
      <Stack.Screen
        name="EditEducationScreen"
        component={EditEducationScreen}
      />
      <Stack.Screen
        name="ExperienceDetailScreen"
        component={ExperienceDetailScreen}
      />
      <Stack.Screen
        name="CreateExperienceScreen"
        component={CreateExperienceScreen}
      />
      <Stack.Screen
        name="EditExperienceScreen"
        component={EditExperienceScreen}
      />
      <Stack.Screen name="SkillDetailScreen" component={SkillDetailScreen} />
      <Stack.Screen name="CreateSkillScreen" component={CreateSkillScreen} />
      <Stack.Screen name="EditSkillScreen" component={EditSkillScreen} />
      <Stack.Screen
        name="ProfileAttachmentDetailScreen"
        component={ProfileAttachmentDetailScreen}
      />
      <Stack.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
      /> */}
    </Stack.Navigator>
  );
}
